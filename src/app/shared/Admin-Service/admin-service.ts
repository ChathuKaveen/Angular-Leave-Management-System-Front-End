import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  urlBase = "http://localhost:8080/auth/";
  constructor(private http:HttpClient){}

  checkIfAdmin(){
    return this.http.get<boolean>(this.urlBase+'isAdmin').pipe(catchError(err=>{
      return throwError(()=>err)
    }))
  }
}
