import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskService} from "../services/task.service";
import {Task} from "../models/task.model";
import {AuthService} from "../services/auth.service";
import {RouterLink, RouterOutlet} from "@angular/router";
import {Company} from "../models/company.model";

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  tasksFiltered: Task[] = [];
  deleteMode = false;

  constructor(private taskService: TaskService, public authService: AuthService) {
  }

  ngOnInit() {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.loadTaskDetails();
    });
  }
  loadTaskDetails() {
    const userCompanyId = this.authService.loggedUser.userId;
    this.tasksFiltered = this.tasks.filter(task => task.assignedToId.userId === userCompanyId);
  }

  get displayTasks() {
    return this.authService.loggedUser.role === 'Admin' ? this.tasks : this.tasksFiltered;
  }
  toggleDelete(): void {
    this.deleteMode = !this.deleteMode;
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.taskId).subscribe({
      next: () => {
        const index = this.tasks.indexOf(task);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }
      },
      error: (err) => {
        console.error('Error deleting task:', err);
      }
    });
  }
}
