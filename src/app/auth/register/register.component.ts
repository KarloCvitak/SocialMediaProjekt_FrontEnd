import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  usernameInUse = false;
  emailInUse = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      // Check username and email availability
      this.authService.checkUsernameEmail(username, email).subscribe(response => {
        this.usernameInUse = response.usernameInUse;
        this.emailInUse = response.emailInUse;

        if (!this.usernameInUse && !this.emailInUse) {
          // Register user if both username and email are available
          this.authService.register({ username, email, password }).subscribe(
            (registerResponse) => {
              console.log('Registration successful:', registerResponse);
              this.router.navigate(['/login']); // Navigate to login page upon successful registration
            },
            error => {
              console.error('Registration error:', error);
              // Handle registration error
            }
          );
        }
      }, error => {
        console.error('Username/email availability check error:', error);
        // Handle check error
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
