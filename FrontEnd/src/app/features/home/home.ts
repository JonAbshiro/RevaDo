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
import { TaskService, Task } from '../../core/services/task.service';
import { SubtaskService, SubTask } from '../../core/services/subtask.service';
import { UserService } from '../../core/services/user.service';
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
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const currentUserId = localStorage.getItem('userId');

    if (!currentUserId) {
      this.error.set('User not logged in');
      this.isLoading.set(false);
      return;
    }

    forkJoin({
      tasks: this.taskService.getTasksByAssignedTo(currentUserId),
      subtasks: this.subtaskService.getSubTasksByAssignedTo(currentUserId)
    }).subscribe({
      next: ({ tasks, subtasks }) => {
        const tasksWithSubtasks: TaskWithSubtasks[] = tasks.map(task => ({
          ...task,
          subtasks: subtasks.filter(s => s.parentTaskId === task.taskId)
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

  openCreateDialog(): void {
    const currentUser = localStorage.getItem('userId') || '';
    const ref = this.dialog.open(TaskEditDialogComponent, {
      data: { isSubtask: false, isCreate: true, currentUser },
      width: '400px',
    });

    ref.afterClosed().subscribe(result => {
      if (!result || result.action !== 'save') return;

      this.taskService.addTask(result.data).subscribe({
        next: () => {
          this.ngOnInit();
        },
        error: () => {
          this.error.set('Failed to create task');
        }
      });
    });
  }

  openCreateSubtaskDialog(task: Task, event: Event): void {
    event.stopPropagation();
    const currentUser = localStorage.getItem('userId') || '';
    const ref = this.dialog.open(TaskEditDialogComponent, {
      data: { isSubtask: true, isCreate: true, currentUser, taskId: task.taskId },
      width: '400px',
    });

    ref.afterClosed().subscribe(result => {
      if (!result || result.action !== 'save') return;

      const subtaskData = {
        ...result.data,
        parentTaskId: task.taskId
      };

      this.subtaskService.addSubTask(subtaskData).subscribe({
        next: () => {
          this.ngOnInit();
        },
        error: () => {
          this.error.set('Failed to create subtask');
        }
      });
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

      if (result.action === 'delete') {
        if (isSubtask) {
          const subtask = task as SubTask;
          this.subtaskService.deleteSubTaskById(subtask.id).subscribe({
            next: () => {
              this.ngOnInit();
            },
            error: () => {
              this.error.set('Failed to delete subtask');
            }
          });
        } else {
          const t = task as Task;
          this.taskService.deleteTaskById(t.taskId).subscribe({
            next: () => {
              this.ngOnInit();
            },
            error: () => {
              this.error.set('Failed to delete task');
            }
          });
        }
      } else if (result.action === 'save') {
        if (isSubtask) {
          const subtask = task as SubTask;
          const updatedSubtask = {
            ...result.data,
            parentTaskId: subtask.parentTaskId
          };
          this.subtaskService.updateSubTask(subtask.id, updatedSubtask).subscribe({
            next: () => {
              this.tasks.update(tasks => tasks.map(t => ({
                ...t,
                subtasks: t.subtasks.map(s =>
                  s.id === subtask.id ? { ...s, ...result.data } : s
                )
              })));
            },
            error: () => {
              this.error.set('Failed to update subtask');
            }
          });
        } else {
          const taskItem = task as Task;
          this.taskService.updateTask(taskItem.taskId, result.data).subscribe({
            next: () => {
              this.tasks.update(tasks => tasks.map(t =>
                t.taskId === taskItem.taskId ? { ...t, ...result.data } : t
              ));
            },
            error: () => {
              this.error.set('Failed to update task');
            }
          });
        }
      }
    });
  }

  statusColor(status: string): string {
    return ({ todo: 'default', 'in-progress': 'accent', done: 'primary' } as Record<string, string>)[status] ?? 'default';
  }

  statusLabel(status: string): string {
    return ({ todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' } as Record<string, string>)[status] ?? status;
  }

  logout(): void {
    this.userService.logout();
  }
}
