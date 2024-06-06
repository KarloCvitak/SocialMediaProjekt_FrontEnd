import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getComments(postId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/comments/posts/${postId}`);
  }

  createComment(comment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/comments`, comment);
  }

  updateComment(id: number, commentData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/comments/${id}`, commentData);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/comments/${id}`);
  }
}
