package com.revature.revado.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringExclude;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest{
    @NotBlank
    private String username;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    @ToStringExclude
    private String password;
    @NotBlank
    private String phoneNumber;
}