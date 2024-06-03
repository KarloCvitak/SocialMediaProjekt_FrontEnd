import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts`);
  }

  createPost(post: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts`, post);
  }

  getPost(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts/${id}`);
  }

  updatePost(id: number, postData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/posts/${id}`, postData);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${id}`);
  }
}
