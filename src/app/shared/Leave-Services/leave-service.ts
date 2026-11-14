import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  urlBase = "http://localhost:8080/leave";
  refreshSubordinates$ = new BehaviorSubject<void>(undefined);

  constructor(private http:HttpClient){}
  
  addLeave(obj:any){
    return this.http.post(`${this.urlBase}` , obj);
  }

  getLeaves(){
      return this.http.get(`${this.urlBase}`).pipe(catchError(err=>{
        return throwError(()=>err);
      }));
  }

  updateLeaves(obj:any , id:number){
    console.log(obj)
    return this.http.patch(`${this.urlBase}/${id}` , obj);
  }

  getLeavesOfSubordinates(){
    return this.http.get(`${this.urlBase}/subordinate`).pipe(catchError(err=>{
      return throwError(()=>err);
    }));
  }

  approveLeaves(obj:any , id:number){
    return this.http.patch(`${this.urlBase}/approve/${id}` , obj).pipe(
      tap(() => this.refreshSubordinates$.next())
    );
  }
}
