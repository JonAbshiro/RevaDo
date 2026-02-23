package com.revature.revado.entity;

import com.revature.revado.model.Status;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "subtasks")
public class SubTask{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private UUID taskId;
    private String name;
    private String description;
    private Status status;
    private String assignedTo;
}

