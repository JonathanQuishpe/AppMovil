import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginSocial } from '../../interfaces/loginSocial';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private path = environment.API;

  constructor(
    private http: HttpClient,
  ) {
  }

  getAll(uri: string, token?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.path}/${uri}`, this.headers(token));
  }

  getLoginSocial(uri: string, params: any): Observable<LoginSocial> {
    let paramsConverter = '';
    if (params != null) {
      paramsConverter = '?';
      let param = null ;
      for ( param in params) {
        if ( param ){
          paramsConverter += param + '=' + params[param] + '&';
        }
      }
      paramsConverter = paramsConverter.slice(0, -1);
    }
    return this.http.get<LoginSocial>(`${this.path}/${uri}` + paramsConverter);
  }

  get(uri: string, params: any, token?: string): Observable<any[]> {
    let paramsConverter = '';
    if (params != null) {
      paramsConverter = '?';
      let param = null ;
      for ( param in params) {
        if ( param ){
          paramsConverter += param + '=' + params[param] + '&';
        }
      }
      paramsConverter = paramsConverter.slice(0, -1);
    }
    return this.http.get<any[]>(`${this.path}/${uri}` + paramsConverter, this.headers(token));
  }

  post(uri: string, params: any, token?: string, contentType?: string): Observable<any> {
    return this.http.post<any>(`${this.path}/${uri}`, params, this.headers(token, contentType));
  }

  update(uri: string, params: any, token?: string) {
    return this.http.put(`${this.path}/${uri}/${params.id}`, params, this.headers(token));
  }
  updateConfig(uri: string, params: any, token?: string) {
    return this.http.put(`${this.path}/${uri}`, params, this.headers(token));
  }

  delete(uri: string, id: string, token?: string) {
    return this.http.delete(`${this.path}/${uri}/${id}`, this.headers(token));
  }

  private headers(token?: string, contentType ?: string ){
    let headers: any;
    if (token){
      if (contentType){
        headers = new HttpHeaders({Authorization: 'Bearer ' + token });
      }else{
        headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: 'Bearer ' + token });
      }
    }else{
      headers = new HttpHeaders();
    }
    return { headers };
  }
}
