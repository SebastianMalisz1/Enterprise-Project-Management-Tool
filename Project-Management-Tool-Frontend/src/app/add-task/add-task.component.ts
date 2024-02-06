import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {TaskService} from "../services/task.service";
import {Task} from "../models/task.model";
import {ProjectService} from "../services/project.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  task: Task = this.taskService.blankTask;
  constructor(private taskService: TaskService, private projectService: ProjectService,
              private userService: UserService, private router: Router) {
  }



addTask(taskForm: NgForm) {
  if (taskForm.valid) {
    this.projectService.getProjectById(taskForm.value.projectId).pipe(
      switchMap(project => {
        this.task.projectId = project;
        return this.userService.getUserById(taskForm.value.assignedById);
      }),
      switchMap(assignedByUser => {
        this.task.assignedById = assignedByUser;
        return this.userService.getUserById(taskForm.value.assignedToId);
      }),
      switchMap(assignedToUser => {
        this.task.assignedToId = assignedToUser;
        return this.taskService.createTask(this.task);
      })
    ).subscribe({
      next: (createdTask) => {
        console.log('Task created successfully:', createdTask);
        alert('Task created successfully');
        this.router.navigate([`/tasks`]);
        taskForm.resetForm();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        alert('Error creating task');
      }
    });
  }
}

}
