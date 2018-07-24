import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

const DEV_ENABLED = false;

/** API Login credentials */
const API_USER = 'JOBY!-pronto-app-API-user!@';
const API_PASS = '5H"$25.R[w@a~gQS}A%';
/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const API_BASE_PATH_DEV: string = "http://localhost:9080/api";
const API_BASE_PATH_PROD: string = "https://www.prontoportals.no/api";

@Injectable()
export class ApiProvider {

  // Headers
  public headers;
  public apiBasePath;

  // Startup
  constructor(
    private http: Http
  ) {

    this.apiBasePath = (DEV_ENABLED) ? API_BASE_PATH_DEV : API_BASE_PATH_PROD;

    // Setting the headers
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Authorization', 'Basic ' + btoa(API_USER + ':' + API_PASS));
  }

  // GET request
  get(uri, params = {}){
    return this.http.get(this.apiBasePath + uri, {
      headers : this.headers,
      params : params,
      withCredentials : true
    }).map((result) => result.json());
  }

  // POST request
  post(uri, body){
    return this.http.post(this.apiBasePath + uri, JSON.stringify(body), {
      headers : this.headers,
      withCredentials : true
    }).map((result) => result.json());
  }

  // PUT request
  put(uri, body){
    return this.http.post(this.apiBasePath + uri, JSON.stringify(body), {
      headers : this.headers,
      withCredentials : true
    }).map((result) => result.json());
  }
}
