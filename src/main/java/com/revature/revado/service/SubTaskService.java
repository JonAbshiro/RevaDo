package com.revature.revado.service;

import com.revature.revado.dto.StatusRequest;
import com.revature.revado.entity.SubTask;
import com.revature.revado.repository.SubTaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
        return subTaskRepository.findSubTasksByTaskId(taskId);
    }

    public void addSubTask(SubTask subTask) {
        subTaskRepository.save(subTask);
    }

    @Transactional
    public void updateSubTask(StatusRequest statusRequest) {
        SubTask subTask = subTaskRepository.findById(statusRequest.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException("SubTask with id " + statusRequest.getId() + " not found.")
                );
        subTask.setStatus(statusRequest.getStatus());
        subTaskRepository.save(subTask);
    }

    public void deleteSubTaskById(UUID id) {
        subTaskRepository.deleteById(id);
    }

}