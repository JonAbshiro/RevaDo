package com.revature.revado.entity;

import com.revature.revado.model.Status;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID taskId;
    private String name;
    private String description;
    private Status status;
    private String assignedTo;
}

