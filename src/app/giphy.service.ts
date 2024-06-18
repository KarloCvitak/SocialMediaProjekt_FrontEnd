import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  private apiKey = '2CZyYQVGCXClexhMsUipkEBxSPCMqK5M';
  private apiUrl = 'https://api.giphy.com/v1/gifs/search';

  constructor(private http: HttpClient) {}

  searchGifs(query: string): Observable<any> {
    const params = {
      api_key: this.apiKey,
      q: query,
      limit: '10'
    };
    return this.http.get(this.apiUrl, { params });
  }
}
