package com.studentpg.common.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Set;

/**
 * Robust image validation utility for user-submitted uploads.
 *
 * <p>Validates files across multiple security layers:
 * 1. File size limits (minimum 32 bytes, maximum 5 MB)
 * 2. MIME type whitelisting (JPEG, PNG, GIF, WebP)
 * 3. Complete magic-byte / file-signature matching
 * 4. Tightened RIFF and WebP chunk structure validation (boundary checking,
 *    odd-chunk padding enforcement, trailing data rejection, and unsupported layout filtering).
 * 5. Genuine decoding and dimension verification (max 4096 x 4096) to prevent
 *    decompression bombs (pixel floods), truncated files, and header-spoofing attacks.
 * </p>
 */
public class ImageValidator {

    private static final Logger logger = LoggerFactory.getLogger(ImageValidator.class);

    public static final long MIN_IMAGE_SIZE = 32;               // 32 bytes
    public static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5 MB
    public static final int MIN_IMAGE_DIMENSION = 1;            // 1 px
    public static final int MAX_IMAGE_DIMENSION = 4096;         // 4096 px (prevents pixel flood)

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    private static final byte[] PNG_SIGNATURE = new byte[]{
            (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
    };

    // GIF signatures: GIF87a and GIF89a
    private static final byte[] GIF87A_SIGNATURE = new byte[]{'G', 'I', 'F', '8', '7', 'a'};
    private static final byte[] GIF89A_SIGNATURE = new byte[]{'G', 'I', 'F', '8', '9', 'a'};

    // Allowed WebP chunk types for static images
    private static final Set<String> ALLOWED_WEBP_CHUNKS = Set.of(
            "VP8 ", "VP8L", "VP8X", "ICCP", "EXIF", "XMP ", "ALPH"
    );

    /**
     * Validates that the provided MultipartFile is a genuine, decodable, safe image.
     *
     * @param file the uploaded MultipartFile
     * @return true if valid and safe, false otherwise
     */
    public static boolean isValidImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        long size = file.getSize();
        if (size < MIN_IMAGE_SIZE || size > MAX_IMAGE_SIZE) {
            logger.debug("Image rejected: file size {} out of bounds [{}, {}]", size, MIN_IMAGE_SIZE, MAX_IMAGE_SIZE);
            return false;
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.trim().toLowerCase())) {
            logger.debug("Image rejected: disallowed MIME type '{}'", contentType);
            return false;
        }

        try {
            byte[] bytes = file.getBytes();
            return isValidImageBytes(bytes, contentType.trim().toLowerCase());
        } catch (IOException ex) {
            logger.warn("Image rejected: failed to read bytes: {}", ex.getMessage());
            return false;
        }
    }

    /**
     * Validates image byte contents against magic bytes, stream structure, dimensions, and decodability.
     *
     * @param bytes raw file bytes
     * @param mimeType sanitized MIME type
     * @return true if valid, false otherwise
     */
    public static boolean isValidImageBytes(byte[] bytes, String mimeType) {
        if (bytes == null || bytes.length < MIN_IMAGE_SIZE || bytes.length > MAX_IMAGE_SIZE) {
            return false;
        }

        // WebP handling
        if (isWebP(bytes)) {
            if (!mimeType.equals("image/webp")) {
                return false;
            }
            // 1. Tightened RIFF & chunk structure validation
            if (!validateWebPStructure(bytes)) {
                return false;
            }
            // 2. Genuine image decoding & dimension validation
            return decodeAndValidateDimensions(bytes);
        }

        // JPEG handling
        if (isJpeg(bytes)) {
            if (!mimeType.equals("image/jpeg") && !mimeType.equals("image/jpg")) {
                return false;
            }
            return decodeAndValidateDimensions(bytes);
        }

        // PNG handling
        if (isPng(bytes)) {
            if (!mimeType.equals("image/png")) {
                return false;
            }
            return decodeAndValidateDimensions(bytes);
        }

        // GIF handling
        if (isGif(bytes)) {
            if (!mimeType.equals("image/gif")) {
                return false;
            }
            return decodeAndValidateDimensions(bytes);
        }

        // Magic bytes do not match any allowed format
        return false;
    }

    /**
     * JPEG magic bytes check: Starts with 0xFF 0xD8 0xFF
     */
    public static boolean isJpeg(byte[] bytes) {
        if (bytes == null || bytes.length < 3) return false;
        return (bytes[0] & 0xFF) == 0xFF
                && (bytes[1] & 0xFF) == 0xD8
                && (bytes[2] & 0xFF) == 0xFF;
    }

    /**
     * PNG magic bytes check: Full 8-byte signature
     */
    public static boolean isPng(byte[] bytes) {
        if (bytes == null || bytes.length < PNG_SIGNATURE.length) return false;
        return Arrays.equals(Arrays.copyOf(bytes, PNG_SIGNATURE.length), PNG_SIGNATURE);
    }

    /**
     * GIF magic bytes check: Full 6-byte header (GIF87a or GIF89a)
     */
    public static boolean isGif(byte[] bytes) {
        if (bytes == null || bytes.length < 6) return false;
        byte[] prefix = Arrays.copyOf(bytes, 6);
        return Arrays.equals(prefix, GIF87A_SIGNATURE) || Arrays.equals(prefix, GIF89A_SIGNATURE);
    }

    /**
     * WebP magic bytes check: RIFF....WEBP (12 bytes)
     */
    public static boolean isWebP(byte[] bytes) {
        if (bytes == null || bytes.length < 12) return false;
        return bytes[0] == 'R' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == 'F'
                && bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P';
    }

    /**
     * Decodes standard formats (JPEG, PNG, GIF, WebP) using ImageIO.
     * Checks dimensions first to avoid allocating memory for decompression bombs.
     * Verifies that the image decodes fully without truncation.
     */
    public static boolean decodeAndValidateDimensions(byte[] bytes) {
        try (ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
             ImageInputStream iis = ImageIO.createImageInputStream(bais)) {

            if (iis == null) {
                return false;
            }

            Iterator<ImageReader> readers = ImageIO.getImageReaders(iis);
            if (!readers.hasNext()) {
                return false;
            }

            ImageReader reader = readers.next();
            try {
                reader.setInput(iis, true, true);
                int width = reader.getWidth(0);
                int height = reader.getHeight(0);

                if (width < MIN_IMAGE_DIMENSION || width > MAX_IMAGE_DIMENSION
                        || height < MIN_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
                    logger.debug("Image rejected: dimensions {}x{} exceed bounds [{}, {}]",
                            width, height, MIN_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION);
                    return false;
                }

                // Verify full decode without truncation
                BufferedImage image = reader.read(0);
                return image != null;
            } finally {
                reader.dispose();
            }
        } catch (Exception ex) {
            logger.debug("Image decode failure: {}", ex.getMessage());
            return false;
        }
    }

    /**
     * Tightened RIFF and chunk-length validation for WebP.
     * Verifies declared file length, chunk boundaries, 1-byte padding rule for odd chunks,
     * unsupported layouts (animations, unknown chunks), and trailing garbage data.
     */
    public static boolean validateWebPStructure(byte[] bytes) {
        if (bytes == null || bytes.length < 30) {
            return false;
        }

        // 1. Check RIFF header: "RIFF" [4-byte size] "WEBP"
        if (bytes[0] != 'R' || bytes[1] != 'I' || bytes[2] != 'F' || bytes[3] != 'F'
                || bytes[8] != 'W' || bytes[9] != 'E' || bytes[10] != 'B' || bytes[11] != 'P') {
            return false;
        }

        // Declared RIFF payload size (little-endian 32-bit unsigned)
        long riffPayloadSize = (bytes[4] & 0xFFL)
                | ((bytes[5] & 0xFFL) << 8)
                | ((bytes[6] & 0xFFL) << 16)
                | ((bytes[7] & 0xFFL) << 24);

        long expectedTotalFileSize = riffPayloadSize + 8;

        // RIFF size must not declare more bytes than actually present
        if (expectedTotalFileSize > bytes.length) {
            return false;
        }

        // Reject trailing data (allow at most 1 padding byte for 2-byte word alignment)
        if (bytes.length > expectedTotalFileSize + 1) {
            logger.debug("WebP rejected: trailing data detected. Expected total size {} but found {}",
                    expectedTotalFileSize, bytes.length);
            return false;
        }

        // 2. Iterate through all RIFF chunks starting at offset 12
        int offset = 12;
        boolean foundImageChunk = false;

        while (offset + 8 <= expectedTotalFileSize) {
            String chunkFourCC = new String(bytes, offset, 4);
            long chunkSize = (bytes[offset + 4] & 0xFFL)
                    | ((bytes[offset + 5] & 0xFFL) << 8)
                    | ((bytes[offset + 6] & 0xFFL) << 16)
                    | ((bytes[offset + 7] & 0xFFL) << 24);

            if (chunkSize < 0) {
                return false;
            }

            // Reject unsupported layouts (animated WebP chunks ANIM/ANMF or unknown chunks)
            if (!ALLOWED_WEBP_CHUNKS.contains(chunkFourCC)) {
                logger.debug("WebP rejected: unsupported chunk type '{}'", chunkFourCC);
                return false;
            }

            int chunkDataOffset = offset + 8;
            long chunkEnd = chunkDataOffset + chunkSize;

            // Chunk must not exceed declared RIFF file length
            if (chunkEnd > expectedTotalFileSize) {
                return false;
            }

            if ("VP8 ".equals(chunkFourCC) || "VP8L".equals(chunkFourCC) || "VP8X".equals(chunkFourCC)) {
                foundImageChunk = true;
            }

            // In RIFF specification, chunks with odd size must include 1 padding byte
            long padding = (chunkSize % 2 != 0) ? 1 : 0;
            offset = (int) (chunkEnd + padding);
        }

        // File must contain at least one valid image payload chunk (VP8, VP8L, or VP8X)
        if (!foundImageChunk) {
            return false;
        }

        // All chunks must exactly consume the declared RIFF payload
        return offset == expectedTotalFileSize || offset == expectedTotalFileSize + 1;
    }
}
