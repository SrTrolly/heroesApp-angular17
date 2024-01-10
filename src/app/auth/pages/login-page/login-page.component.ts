import { Component } from '@angular/core';
import { AuthServices } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {


  constructor(
    private authService: AuthServices,
    private router: Router
  ) { }

  onLogin() {
    this.authService.login("nicolas", "123456")
      .subscribe(user => {
        this.router.navigate(["/"]);
      })
  }

}
