package com.revature.revado.service;

import com.revature.revado.dto.SubtaskCreateRequest;
import com.revature.revado.entity.SubTask;
import com.revature.revado.repository.SubTaskRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubTaskService{
    private final SubTaskRepository subTaskRepository;

    public List<SubTask> getSubTasks() {
        return subTaskRepository.findAll();
    }

    public List<SubTask> getSubTasksByAssignedTo(String assignedTo) {
        return subTaskRepository.findSubTasksByAssignedTo(assignedTo);
    }

    public List<SubTask> getSubTasksByTaskId(UUID taskId) {
        return subTaskRepository.findSubTasksByParentTaskId(taskId);
    }

    public void updateSubTask(UUID id, SubtaskCreateRequest updateRequest) {
        SubTask subTask = subTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));
        subTask.setName(updateRequest.getName());
        subTask.setDescription(updateRequest.getDescription());
        subTask.setStatus(updateRequest.getStatus());
        subTask.setAssignedTo(updateRequest.getAssignedTo());
        subTaskRepository.save(subTask);
    }

    public void addSubTask(SubtaskCreateRequest subTaskRequest) {
        SubTask subTask = new SubTask();
        subTaskRequest.setName(subTaskRequest.getName());
        subTaskRequest.setDescription(subTaskRequest.getDescription());
        subTask.setParentTaskId(UUID.fromString(subTaskRequest.getParentTaskId()));
        subTask.setAssignedTo(StringUtils.isNotBlank(subTaskRequest.getAssignedTo()) ? subTaskRequest.getAssignedTo() : null);
        subTaskRepository.save(subTask);
    }

    public void deleteSubTaskById(UUID id) {
        subTaskRepository.deleteById(id);
    }

}