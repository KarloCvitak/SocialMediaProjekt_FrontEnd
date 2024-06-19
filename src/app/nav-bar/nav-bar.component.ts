// navbar.component.ts
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { AuthService } from '../auth.service';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  showCreatePost = true;
  isLoggedIn = false;
  userId: string | null;
  constructor(private authService: AuthService, private router: Router) {
    this.userId = this.authService.getCurrentUserId();

  }

  @Output() toggleCreatePost = new EventEmitter<boolean>(); // Emit boolean type

  togglePostCreate() {
    this.toggleCreatePost.emit();
  }

  ngOnInit(): void {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRoute();
      }
    });


    this.authService.getAuthState().subscribe((state: boolean) => {
      this.isLoggedIn = state;
    });
  }



  checkRoute() {
    const currentRoute = this.router.url;
    this.showCreatePost = currentRoute === '/' || currentRoute.startsWith('/profile');
    this.toggleCreatePost.emit(showCreatePost);
  }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);

  }
}
