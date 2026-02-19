package com.revature.revado.service;

import com.revature.revado.entity.SubTask;
import com.revature.revado.repository.SubTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubTaskService{
    private final SubTaskRepository subTaskRepository;

    public List<SubTask> getSubTasks() {
        return subTaskRepository.findAll();
    }

}