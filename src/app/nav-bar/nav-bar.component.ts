// navbar.component.ts
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { AuthService } from '../auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isLoggedIn = false;
  userId: string | null;
  constructor(private authService: AuthService, private router: Router) {
    this.userId = this.authService.getCurrentUserId();
  }

  @Output() toggleCreatePost = new EventEmitter<void>();

  togglePostCreate() {
    this.toggleCreatePost.emit();
  }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe((state: boolean) => {
      this.isLoggedIn = state;
    });
  }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);

  }
}
