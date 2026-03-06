package com.revature.revado.dto;

import com.revature.revado.model.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskCreateRequest{
    @NotBlank
    private String name;
    @NotBlank
    private String description;
    private String assignedTo;
    private Status status;
}