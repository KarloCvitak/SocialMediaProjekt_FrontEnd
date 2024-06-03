import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/authenticate/register`, user);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getProfile(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  updateProfile(id: number, profileData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, profileData);
  }
}
