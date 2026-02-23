package com.revature.revado.controller;

import com.revature.revado.dto.StatusRequest;
import com.revature.revado.entity.SubTask;
import com.revature.revado.service.SubTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SubTaskController {
    private final SubTaskService subTaskService;

    @GetMapping(path = "/subtasks")
    public List<SubTask> getSubTasks() {
        return subTaskService.getSubTasks();
    }

    @GetMapping(path = "/subtasks/assignedTo")
    public List<SubTask> getSubTasksByAssignedTo(@RequestParam String assignedTo) {
        return subTaskService.getSubTasksByAssignedTo(assignedTo);
    }
    @GetMapping(path= "/subtasks/taskId")
    public List<SubTask> getSubTasksByTaskId(@RequestParam String taskId) {
        return subTaskService.getSubTasksByTaskId(java.util.UUID.fromString(taskId));
    }

    @DeleteMapping(path = "/subtasks/{id}")
    public void deleteSubTaskById(@PathVariable String id) {
        subTaskService.deleteSubTaskById(java.util.UUID.fromString(id));
    }

    @PostMapping(path = "/subtasks")
    public void addSubTask(@RequestBody SubTask subTask) {
        subTaskService.addSubTask(subTask);
    }

    @PatchMapping(path = "/subtasks/status")
    public void updateSubTaskStatus(@RequestBody StatusRequest updateRequest) {
        subTaskService.updateSubTask(updateRequest);
    }
}
