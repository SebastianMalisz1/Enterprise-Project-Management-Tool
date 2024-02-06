import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {CompanyService} from "../services/company.service";
import {map} from "rxjs";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  adminCompanies: any[] = [this.companyService.getAllCompanies().pipe(
    map(companies => companies.map(company => company.name))
  ).subscribe(adminCompanies => {
    this.adminCompanies = adminCompanies;
  })
  ];
  yourCompany: string[] = [this.authService.loggedUser.companyId.name];
  user: User = this.userService.blankUser;

  constructor(private userService: UserService, private companyService: CompanyService,
              private router: Router, private authService: AuthService) {
  }

  get displayCompanies() {
    return this.authService.loggedUser.role === 'Admin' ? this.adminCompanies : this.yourCompany;
  }
  signUp(userForm: NgForm) {
    if (userForm.valid) {
      this.companyService.getCompanyById(userForm.value.companyId).subscribe(company => {
        this.user.companyId = company;
        this.userService.createUser(this.user).subscribe(
          newUser => {
            console.log('User signed up successfully:', newUser);
            alert('User signed up successfully');
            this.router.navigate([`/users`]);
          },
          error => {
            console.error('Error during sign up:', error);
            alert('Error during sign up');
          }
        );
      });
    }
  }
}
