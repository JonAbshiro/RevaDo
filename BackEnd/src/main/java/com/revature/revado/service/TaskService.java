package com.revature.revado.service;

import com.revature.revado.dto.StatusRequest;
import com.revature.revado.dto.TaskCreateRequest;
import com.revature.revado.entity.Task;
import com.revature.revado.model.Status;
import com.revature.revado.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByAssignedTo(String assignedTo) {
        return taskRepository.findByAssignedTo(assignedTo);
    }

    public Task getTask(UUID taskId) {
        return taskRepository.getTaskByTaskId(taskId);
    }

    public void addTask(TaskCreateRequest task) {
        Task newTask = new Task();
        newTask.setName(task.getName());
        newTask.setDescription(task.getDescription());
        newTask.setAssignedTo(task.getAssignedTo());
        newTask.setStatus(Status.TODO);
        taskRepository.save(newTask);
    }

    public void updateTask(StatusRequest statusRequest) {
        Task task = taskRepository.findById(statusRequest.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Task with id " + statusRequest.getId() + " not found.")
                );
        task.setStatus(statusRequest.getStatus());
        taskRepository.save(task);
    }

    public void deleteTaskById(UUID id) {
        taskRepository.deleteById(id);
    }

    public void updateTask(UUID id, TaskCreateRequest updateRequest) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setName(updateRequest.getName());
        task.setDescription(updateRequest.getDescription());
        task.setStatus(updateRequest.getStatus());
        task.setAssignedTo(updateRequest.getAssignedTo());
        taskRepository.save(task);
    }

}
