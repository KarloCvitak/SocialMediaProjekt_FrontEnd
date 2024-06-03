// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/authenticate/login`, credentials);
  }


  getCurrentUserId(): string | null {
    const token = localStorage.getItem('token');

    if (token) {
      // Decode the token
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log(tokenPayload.id);
      return tokenPayload.id;
    } else {
      // Token doesn't exist, return null
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.authState.next(true);
  }

  clearToken(): void {
    localStorage.removeItem('token');
    this.authState.next(false);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }
}
