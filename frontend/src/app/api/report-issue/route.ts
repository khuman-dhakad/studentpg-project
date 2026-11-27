import { NextResponse } from 'next/server';
import { createSupportTransporter, escapeHtml, getSupportMailAddress } from '@/lib/mail';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const issueType = String(formData.get('issueType') ?? formData.get('title') ?? '').trim();
    const pgListing = String(formData.get('pgListing') ?? '').trim();
    const location = String(formData.get('location') ?? '').trim();
    const description = String(formData.get('description') ?? formData.get('detail') ?? '').trim();
    const allFiles = [...formData.getAll('file'), ...formData.getAll('images')].filter(
      (entry): entry is File => typeof entry === 'object' && entry !== null && 'size' in entry && (entry as File).size > 0
    );

    if (allFiles.length > 5) {
      return NextResponse.json({ success: false, message: 'A maximum of 5 images can be attached.' }, { status: 400 });
    }

    if (
      !issueType ||
      issueType.length > 140 ||
      !description ||
      description.length > 4000 ||
      pgListing.length > 200 ||
      location.length > 200
    ) {
      return NextResponse.json({ success: false, message: 'Please provide valid report details.' }, { status: 400 });
    }

    if (/[\r\n]/.test(issueType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid characters detected in issue category.' },
        { status: 400 }
      );
    }

    const file = allFiles[0] || null;

    if (file && file.size > 0 && (!allowedImageTypes.has(file.type) || file.size > MAX_FILE_SIZE)) {
      return NextResponse.json({ success: false, message: 'Attachment must be a JPG, PNG, or WebP image up to 5 MB.' }, { status: 400 });
    }

    const transporter = createSupportTransporter();
    const supportAddress = getSupportMailAddress();

    // Attachment setup if file is uploaded
    const attachments = [];
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      attachments.push({
        filename: file.name.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120),
        content: buffer,
      });
    }

    // HTML Email Template to received in your Inbox
    const mailOptions = {
      from: supportAddress,
      to: supportAddress,
      subject: `New issue reported: ${issueType}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #e11d48;">🚨 New Issue Reported on StudentPG</h2>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Issue Category:</strong> ${escapeHtml(issueType)}</p>
          <p><strong>Location/Area:</strong> ${escapeHtml(String(location ?? ''))}</p>
          <p><strong>PG Listing Reference:</strong> ${escapeHtml(String(pgListing || 'N/A'))}</p>
          <p><strong>Description:</strong></p>
          <blockquote style="background: #f8fafc; padding: 12px; border-left: 4px solid #6366f1;">
            ${escapeHtml(description)}
          </blockquote>
          ${file ? `<p><strong>Attachment:</strong> Attached with this email (${escapeHtml(file.name)})</p>` : ''}
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 11px; color: #64748b;">This issue was reported via StudentPG Report Portal.</p>
        </div>
      `,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Report sent to email successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send report email' },
      { status: 500 }
    );
  }
}