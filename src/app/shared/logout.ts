import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Logout {
  constructor(private router:Router , private http:HttpClient){}
  token = localStorage.getItem("loginToken");
  logout(){
    if(this.token){
      localStorage.removeItem("loginToken");
    }
    this.router.navigateByUrl('/login')
  }

  tokenValidity(){
    if(this.token){
      this.http.post('http://localhost:8080/auth/validate' , this.token).subscribe((res)=>{
        console.log(res)
        if(res){

        }else{
          this.logout();
        }
      })
    }
  }
  
}
