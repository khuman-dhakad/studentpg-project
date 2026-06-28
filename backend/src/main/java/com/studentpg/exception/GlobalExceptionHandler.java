package com.studentpg.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, Object> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("message", "Validation Failed");
        response.put("errors", errors);

        return response;
    }
}