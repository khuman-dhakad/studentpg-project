package com.studentpg.modules.owner.controller;

import com.studentpg.modules.owner.dto.request.ChangePasswordRequest;
import com.studentpg.modules.owner.dto.request.ForgotPasswordRequest;
import com.studentpg.modules.owner.dto.request.OwnerRegisterRequest;
import com.studentpg.modules.owner.dto.request.ResetPasswordRequest;
import com.studentpg.modules.owner.dto.request.UpdateOwnerProfileRequest;

import com.studentpg.modules.owner.dto.response.MessageResponse;
import com.studentpg.modules.owner.dto.response.OwnerProfileResponse;

import com.studentpg.modules.owner.service.OwnerService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@RequestMapping("/api/owners")
@RequiredArgsConstructor
public class OwnerController {


    private final OwnerService ownerService;


    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerOwner(
            @Valid @RequestBody OwnerRegisterRequest request
    ) {
        String message = ownerService.registerOwner(request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(new MessageResponse(true, message));
    }


    @GetMapping("/profile")
    public OwnerProfileResponse getMyProfile() {

        return ownerService.getMyProfile();

    }


   @PutMapping("/profile")
public ResponseEntity<MessageResponse> updateMyProfile(
        @Valid
        @RequestBody
        UpdateOwnerProfileRequest request
) {

    String message = ownerService.updateMyProfile(request);

    return ResponseEntity.ok(
            new MessageResponse(true, message)
    );
}

    


    @PutMapping("/change-password")
public ResponseEntity<MessageResponse> changePassword(
        @Valid
        @RequestBody
        ChangePasswordRequest request
) {

    String message = ownerService.changePassword(request);

    return ResponseEntity.ok(
            new MessageResponse(true, message)
    );
}


    @PostMapping({

            "/forgot-password",

            "/send-otp",

            "/request-otp"

    })

    public MessageResponse forgotPassword(

            @Valid

            @RequestBody

            ForgotPasswordRequest request

    ) {


        String message =

                ownerService.forgotPassword(

                        request

                );


        return new MessageResponse(

                true,

                message

        );

    }


    @PostMapping("/reset-password")
    public MessageResponse resetPassword(

            @Valid

            @RequestBody

            ResetPasswordRequest request

    ) {


        String message =

                ownerService.resetPassword(

                        request

                );


        boolean success =

                "Password reset successfully."

                        .equals(message);


        return new MessageResponse(

                success,

                message

        );

    }


    @PostMapping(
        value = "/profile-image",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public ResponseEntity<MessageResponse> uploadProfileImage(
        @RequestParam("image")
        MultipartFile image
) throws IOException {

    String message = ownerService.uploadProfileImage(image);

    return ResponseEntity.ok(
            new MessageResponse(true, message)
    );
}


    @DeleteMapping("/profile-image")
public ResponseEntity<MessageResponse> deleteProfileImage()
        throws IOException {

    String message = ownerService.deleteProfileImage();

    return ResponseEntity.ok(
            new MessageResponse(true, message)
    );
}

}