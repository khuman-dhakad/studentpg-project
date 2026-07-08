package com.studentpg.common.util;

public class InputSanitizer {

    // Blocks MongoDB operator characters and keeps input length safe.
    // Use this on any free-text input that goes into a database query (like search).
    public static boolean isSafe(String input) {

        if (input == null) {
            return true;
        }

        if (input.length() > 100) {
            return false;
        }

        // Reject Mongo operator symbols and script-like characters
        String[] blocked = { "$", "{", "}", "javascript:", "<script" };

        String lower = input.toLowerCase();

        for (String bad : blocked) {
            if (lower.contains(bad)) {
                return false;
            }
        }

        return true;
    }
}