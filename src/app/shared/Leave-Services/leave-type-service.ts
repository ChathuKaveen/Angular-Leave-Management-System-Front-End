import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeaveDayService {
  urlBase = "http://localhost:8080/leave-type";
  constructor(private http:HttpClient){}


  addLeaveType(obj:any){
    return this.http.post(`${this.urlBase}` , obj)
  }

  getLeaveTypes(){
    return this.http.get(`${this.urlBase}`).pipe(catchError(err=>{
      return throwError(()=>err);
    }));
  }
  getLeaveTypeById(id:number){
    return this.http.get(`${this.urlBase}/${id}`).pipe(catchError(err=>{
      return throwError(()=>err);
    }));
  }
}
