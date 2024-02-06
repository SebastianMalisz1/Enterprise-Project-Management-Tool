import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {ProjectService} from "../services/project.service";
import {Project} from "../models/project.model";
import {UserService} from "../services/user.service";
import {CompanyService} from "../services/company.service";
import {Router} from "@angular/router";
import {forkJoin, map} from 'rxjs';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss'
})
export class AddProjectComponent {
  project: Project = this.projectService.blankProject;
  adminCompanies: any[] = [this.companyService.getAllCompanies().pipe(
    map(companies => companies.map(company => company.name))
  ).subscribe(adminCompanies => {
    this.adminCompanies = adminCompanies;
  })
  ];
  yourCompany: string[] = [this.authService.loggedUser.companyId.name];

  constructor(private projectService: ProjectService, private userService: UserService,
              private companyService: CompanyService, private router: Router, private authService: AuthService) {
  }

  get displayCompanies() {
    return this.authService.loggedUser.role === 'Admin' ? this.adminCompanies : this.yourCompany;
  }
addProject(projectForm: NgForm) {
  if (projectForm.valid) {
    forkJoin({
      user: this.userService.getUserById(projectForm.value.managerId),
      company: this.companyService.getCompanyById(projectForm.value.companyId)
    }).subscribe({
      next: ({ user, company }) => {
        this.project.managerId = user;
        this.project.companyId = company;
        this.projectService.createProject(this.project).subscribe(
          newProject => {
            console.log('Project created successfully:', newProject);
            alert('Project created successfully');
            this.router.navigate([`/projects`]);
          },
          error => {
            console.error('Error during project creation:', error);
            alert('Error during project creation');
          }
        );
      },
      error: error => {
        console.error('Error fetching user or company:', error);
        alert('Error during project preparation');
      }
    });
  }
}

}
