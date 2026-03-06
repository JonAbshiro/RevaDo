import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskService, Task, StatusRequest as TaskStatusRequest } from '../../core/services/task.service';
import { SubtaskService, SubTask, StatusRequest as SubtaskStatusRequest } from '../../core/services/subtask.service';
import { TaskEditDialogComponent } from './task-edit-dialog/task-edit-dialog.component';
import { forkJoin } from 'rxjs';

export interface TaskWithSubtasks extends Task {
  subtasks: SubTask[];
}

// ─── Home Component ───────────────────────────────────────────────
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  tasks = signal<TaskWithSubtasks[]>([]);
  isLoading = signal(true);
  error = signal('');

  constructor(
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    forkJoin({
      tasks: this.taskService.getTasks(),
      subtasks: this.subtaskService.getSubTasks()
    }).subscribe({
      next: ({ tasks, subtasks }) => {
        const tasksWithSubtasks: TaskWithSubtasks[] = tasks.map(task => ({
          ...task,
          subtasks: subtasks.filter(s => s.taskId === task.taskId)
        }));
        this.tasks.set(tasksWithSubtasks);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tasks');
        this.isLoading.set(false);
      }
    });
  }

  openEditDialog(task: Task | SubTask, isSubtask: boolean, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(TaskEditDialogComponent, {
      data: { task, isSubtask },
      width: '400px',
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      if (isSubtask) {
        const subtask = task as SubTask;
        if (result.status !== subtask.status) {
          const req: SubtaskStatusRequest = { id: subtask.subTaskId, status: result.status };
          this.subtaskService.updateSubTaskStatus(req).subscribe();
        }
        this.tasks.update(tasks => tasks.map(t => ({
          ...t,
          subtasks: t.subtasks.map(s =>
            s.subTaskId === subtask.subTaskId ? { ...s, ...result } : s
          )
        })));
      } else {
        const t = task as Task;
        if (result.status !== t.status) {
          const req: TaskStatusRequest = { id: t.taskId, status: result.status };
          this.taskService.updateTaskStatus(req).subscribe();
        }
        this.tasks.update(tasks => tasks.map(t =>
          t.taskId === task.taskId ? { ...t, ...result } : t
        ));
      }
    });
  }

  statusColor(status: string): string {
    return ({ todo: 'default', 'in-progress': 'accent', done: 'primary' } as Record<string, string>)[status] ?? 'default';
  }

  statusLabel(status: string): string {
    return ({ todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' } as Record<string, string>)[status] ?? status;
  }
}
