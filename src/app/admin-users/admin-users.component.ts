// admin-users.component.ts

import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  roles: string[] = ['user', 'admin']; // Define available roles

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(response => {
      if (response && response.users) {
        this.users = response.users;
      } else {
        console.error('Error fetching users:', response);
      }
    });
  }

  updateUserRole(user: any, newRole: string) {
    this.userService.updateUserRole(user.id, newRole).subscribe(
      () => {
        // Update user role in UI upon successful update
        user.role = newRole;
        console.log(`Updated role of user ${user.username} to ${newRole}`);
      },
      error => {
        console.error('Error updating user role:', error);
        // Handle error scenario
      }
    );
  }
}
