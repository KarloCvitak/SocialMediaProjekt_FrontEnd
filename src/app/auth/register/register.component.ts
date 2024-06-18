import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  checkUsernameEmailAvailability() {
    const { username, email } = this.registerForm.value;
    this.authService.checkUsernameEmail(username, email).subscribe(response => {
      this.usernameInUse = response.usernameInUse;
      this.emailInUse = response.emailInUse;
    });
  }

  onSubmit() {

    this.checkUsernameEmailAvailability();

    if (this.registerForm.valid && !this.usernameInUse && !this.emailInUse) {
      this.authService.register(this.registerForm.value).subscribe(response => {
        if (response && response.token) {
          this.authService.setToken(response.token);
          this.router.navigate(['']);
        } else {
          console.error('Invalid registration response', response);
        }
      }, error => {
        console.error('Registration error', error);
      });
    }
  }
}
