import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getLikes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/likes`);
  }

  addLike(like: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/likes`, like);
  }

  removeLike(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/likes/${id}`);
  }

  removeLikeFromAPost(postId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/likes/posts/${postId}`);
  }



}
