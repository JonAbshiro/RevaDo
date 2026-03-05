package com.revature.revado.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubtaskCreateRequest{
    @NotBlank
    private String name;
    @NotBlank
    private String description;
    @NotBlank
    private UUID parentTaskId;
    private String assignedTo;
}