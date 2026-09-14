package com.studentpg.common.exception;

import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import jakarta.validation.ConstraintViolationException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
        private static final Logger logger =
        LoggerFactory.getLogger(
                GlobalExceptionHandler.class
        );


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidationException(
            MethodArgumentNotValidException ex
    ) {

        Map<String, String> errors =
                new LinkedHashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );


        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "success",
                false
        );

        response.put(
                "status",
                HttpStatus.BAD_REQUEST.value()
        );

        response.put(
                "message",
                "Validation Failed"
        );

        response.put(
                "errors",
                errors
        );

        return ResponseEntity
        .badRequest()
        .body(response);
    }

    @ExceptionHandler(IllegalStateException.class)
public ResponseEntity<Map<String, Object>>
handleIllegalStateException(
        IllegalStateException ex
) {

    Map<String, Object> response =
            new LinkedHashMap<>();

    response.put(
            "success",
            false
    );

    response.put(
            "status",
            400
    );

    response.put(
            "message",
            ex.getMessage()
    );

    return ResponseEntity
            .badRequest()
            .body(response);
} 

@ExceptionHandler(IllegalArgumentException.class)
public ResponseEntity<Map<String,Object>>
handleIllegalArgumentException(
        IllegalArgumentException ex
){

    Map<String,Object> response =
            new LinkedHashMap<>();

    response.put(
            "success",
            false
    );

    response.put(
            "status",
            400
    );

    response.put(
            "message",
            ex.getMessage()
    );

    return ResponseEntity
            .badRequest()
            .body(response);
}

@ExceptionHandler({ConstraintViolationException.class, MethodArgumentTypeMismatchException.class, MissingServletRequestParameterException.class})
public ResponseEntity<Map<String,Object>> handleBadRequestValidation(
        Exception ex
) {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("success", false);
    response.put("status", 400);
    response.put("message", ex.getMessage());
    return ResponseEntity.badRequest().body(response);
}

@ExceptionHandler(BadCredentialsException.class)
public ResponseEntity<Map<String,Object>>
handleBadCredentials(
        BadCredentialsException ex
){

    Map<String,Object> response =
            new LinkedHashMap<>();

    response.put(
            "success",
            false
    );

    response.put(
            "status",
            401
    );

    response.put(
            "message",
            "Invalid email or password"
    );

    return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(response);
}
 
 
 @ExceptionHandler(AccessDeniedException.class)
public ResponseEntity<Map<String,Object>>
handleAccessDenied(
        AccessDeniedException ex
){

    Map<String,Object> response =
            new LinkedHashMap<>();

    response.put(
            "success",
            false
    );

    response.put(
            "status",
            403
    );

    response.put(
            "message",
            "Access denied"
    );

    return ResponseEntity
            .status(403)
            .body(response);
}
  @ExceptionHandler(DuplicateKeyException.class)
public ResponseEntity<Map<String,Object>>
handleDuplicateKey(
        DuplicateKeyException ex
){

    Map<String,Object> response =
            new LinkedHashMap<>();

    response.put(
            "success",
            false
    );

    response.put(
            "status",
            409
    );

    response.put(
            "message",
            "Duplicate data already exists."
    );

    return ResponseEntity
            .status(409)
            .body(response);
} 
@ExceptionHandler(MaxUploadSizeExceededException.class)
public ResponseEntity<Map<String,Object>>
handleFileTooLarge(
        MaxUploadSizeExceededException ex
){

    Map<String,Object> response =
            new LinkedHashMap<>();

    response.put(
            "success",
            false
    );

    response.put(
            "status",
            413
    );

    response.put(
            "message",
            "Maximum upload size exceeded."
    );

    return ResponseEntity
            .status(413)
            .body(response);
} 

@ExceptionHandler(Exception.class)
public ResponseEntity<Map<String,Object>>
handleException(
        Exception ex
){

    logger.error(
        "Unhandled exception occurred: {}",
        ex.getMessage(),
        ex
);

    Map<String,Object> response =
            new LinkedHashMap<>();

    response.put(
            "success",
            false
    );

    response.put(
            "status",
            500
    );

    response.put(
            "message",
            "Internal server error."
    );

    return ResponseEntity
            .status(500)
            .body(response);
} 


@ExceptionHandler(SecurityException.class)
public ResponseEntity<Map<String, Object>> handleSecurityException(
        SecurityException ex
) {

    Map<String, Object> response = new LinkedHashMap<>();

    response.put("success", false);
    response.put("status", 403);
    response.put("message", ex.getMessage());

    return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(response);
}

} 