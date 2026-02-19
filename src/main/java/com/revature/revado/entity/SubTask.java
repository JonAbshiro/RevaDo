package com.revature.revado.entity;

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
}

