import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupervisorService {
  urlBase = "http://localhost:8080/supervisor-relationship";
  constructor(private http:HttpClient){}

  checkIfSupervisor(){
    return this.http.get<boolean>(this.urlBase).pipe(catchError(err=>{
      return throwError(()=>err)
    }))
  }
}
