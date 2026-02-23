package com.revature.revado.dto;

import com.revature.revado.model.Status;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@RequiredArgsConstructor
@Data
public class StatusRequest {
    private final Status status;
    private final UUID id;
}