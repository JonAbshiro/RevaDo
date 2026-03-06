import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../core/services/task.service';
import { SubTask } from '../../../core/services/subtask.service';

@Component({
  selector: 'app-task-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './task-edit-dialog.component.html',
  styleUrls: ['./task-edit-dialog.component.css']
})
export class TaskEditDialogComponent {
  editForm: FormGroup;
  isCreateMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task | SubTask; isSubtask: boolean; isCreate?: boolean; currentUser?: string }
  ) {
    this.isCreateMode = data.isCreate ?? false;
    this.editForm = this.fb.group({
      name: [data.task?.name || '', Validators.required],
      description: [data.task?.description || ''],
      status: [data.task?.status || 'TODO', Validators.required],
    });
  }

  save(): void {
    if (this.editForm.valid) {
      const formValue = {
        ...this.editForm.value,
        assignedTo: this.data.currentUser || 'current-user'
      };
      this.dialogRef.close({ action: 'save', data: formValue });
    }
  }

  delete(): void {
    this.dialogRef.close({ action: 'delete' });
  }
}
