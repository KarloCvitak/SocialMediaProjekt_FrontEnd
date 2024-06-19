import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('Form Submitted', this.loginForm.value);
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(response => {
        console.log('Login Response:', response);
        if (response && response.token) {
          this.authService.setToken(response.token);
          console.log('Token Set:', response.token);
          this.router.navigate(['']);
        } else {
          this.errorMessage = 'Invalid login response';
          console.error('Invalid login response', response);
        }
      }, error => {
        this.errorMessage = 'Incorrect email or password. Please try again.';
        console.error('Login error', error);
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
