import {Component, OnInit} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {Project} from "../models/project.model";
import {ProjectService} from "../services/project.service";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Task} from "../models/task.model";
import {Company} from "../models/company.model";
import {TasksComponent} from "../tasks/tasks.component";


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  deleteMode = false;

  constructor(private projectService: ProjectService, private router: Router,
              public authService: AuthService) {}

  currentFilter: string = "";

  setFilter(role: string): void {
    this.currentFilter = role;
  }

  toggleDelete(): void {
    this.deleteMode = !this.deleteMode;
  }

  selectProject(project : Project) {
    console.log("Clicked in " + project.projectId + " " + project.name);
    this.router.navigate([`/${project.projectId}/tasks`]);
  }
  ngOnInit() {
    this.projectService.getAllProjects().subscribe(projects => {
      this.projects = projects;
      this.loadProjectDetails();
    });
  }
  loadProjectDetails() {
    const userCompanyId = this.authService.loggedUser.companyId.companyId;
    this.filteredProjects = this.projects.filter(project => project.companyId.companyId === userCompanyId);
    //&& task.projectId.projectId == project.projectId
  }

  get displayProjects() {
    return this.authService.loggedUser.role === 'Admin' ? this.projects : this.filteredProjects;
  }

  deleteProject(project: Project): void {
    this.projectService.deleteProject(project.projectId).subscribe({
      next: () => {
        const index = this.projects.indexOf(project);
        if (index !== -1) {
          this.projects.splice(index, 1);
        }
      },
      error: (err) => {
        console.error('Error deleting company:', err);
      }
    });
  }

  protected readonly formatDate = formatDate;
}
