import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
//const API_BASE_PATH: string = "http://localhost:8999/api";
const API_BASE_PATH: string = "https://www.prontoportals.no/api";
@Injectable()
export class ApiProvider {

  constructor(
    private http: Http
  ) {}

  get(uri, params = {}){
    return this.http.get(API_BASE_PATH + uri, {
      params : params
    }).map((result) => result.json());
  }

  post(uri, body){
    
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    
    return this.http.post(API_BASE_PATH + uri, JSON.stringify(body), {
      headers : headers
    }).map((result) => result.json());
  }

  put(uri, body){

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    
    return this.http.post(API_BASE_PATH + uri, JSON.stringify(body), {
      headers : headers
    }).map((result) => result.json());
  }
}
