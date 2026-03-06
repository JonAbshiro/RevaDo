package com.revature.revado.controller;

import com.revature.revado.dto.StatusRequest;
import com.revature.revado.dto.TaskCreateRequest;
import com.revature.revado.entity.Task;
import com.revature.revado.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    @GetMapping(path = "/tasks")
    public List<Task> getTasks() {
        return taskService.getTasks();
    }

    @GetMapping(path = "/tasks/assignedTo")
    public List<Task> getTasksByAssignedTo(@RequestParam String assignedTo) {
        return taskService.getTasksByAssignedTo(assignedTo);
    }
    @GetMapping(path= "/tasks/taskId")
    public Task getTaskByTaskId(@RequestParam String taskId) {
        return taskService.getTask(java.util.UUID.fromString(taskId));
    }

    @DeleteMapping(path = "/tasks/{id}")
    public void deleteTaskById(@PathVariable String id) {
        taskService.deleteTaskById(java.util.UUID.fromString(id));
    }

    @PostMapping(path = "/tasks")
    public void addTask(@RequestBody TaskCreateRequest task) {
        taskService.addTask(task);
    }

    @PostMapping(path = "/tasks/status")
    public void updateTaskStatus(@RequestBody StatusRequest updateRequest) {
        taskService.updateTask(updateRequest);
    }

    @PatchMapping(path = "/tasks/{id}")
    public void updateTask(@PathVariable String id, @RequestBody @Valid TaskCreateRequest updateRequest) {
        taskService.updateTask(java.util.UUID.fromString(id), updateRequest);
    }
}
