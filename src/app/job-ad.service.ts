import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobAd } from './job-ad';

@Injectable({
  providedIn: 'root'
})
export class JobAdService {

  apiUrl = `http://localhost:3000/ads/`;

  constructor(
    private _httpClient: HttpClient
  ) { }


  find(search?: string, isPublished?: boolean): Observable<JobAd> {
    let params = {};

    if (search !== null && search !== undefined) { params = { ...params, search } }
    if (isPublished !== null) { params = { ...params, isPublished } }

    return this._httpClient.get<JobAd>(`${this.apiUrl}`, { params });
  }

  create(jobAd: JobAd): Observable<any> {
    return this._httpClient.post<JobAd>(`${this.apiUrl}`, jobAd);
  }

  findById(id: string): Observable<JobAd> {
    return this._httpClient.get<JobAd>(`${this.apiUrl}${id}`);
  }

  edit(id: string, jobAd: any): Observable<any> {
    return this._httpClient.put<any>(`${this.apiUrl}${id}`, jobAd);
  }

  updateStatus(id: string, isPublished: boolean): Observable<any> {
    return this._httpClient.patch<any>(`${this.apiUrl}${id}`, { isPublished });
  }

  delete(id: string): Observable<null> {
    return this._httpClient.delete<null>(`${this.apiUrl}${id}`);
  }

}
