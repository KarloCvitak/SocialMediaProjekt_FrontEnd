import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }



  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getProfile(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  updateProfile(id: number, profileData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, profileData);
  }

  updateUserRole(userId: number, newRole: string): Observable<any> {
    // Assuming your API expects 'role' to be updated in profileData
    return this.updateProfile(userId, { role: newRole });
  }
}
