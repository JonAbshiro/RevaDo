package com.revature.revado.controller;

import com.revature.revado.entity.SubTask;
import com.revature.revado.service.SubTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SubTaskController {
    private final SubTaskService subTaskService;

    @GetMapping(path = "/subtasks")
    public List<SubTask> getSubTasks() {
        return subTaskService.getSubTasks();
    }
}
