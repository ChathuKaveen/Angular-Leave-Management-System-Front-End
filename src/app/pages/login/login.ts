import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  activeForm: 'login' | 'register' = 'login';

  switchForm(type: 'login' | 'register') {
    this.activeForm = type;
  }

  loginObj: any = {
    "email": "",
    "password": ""
  }

  signupObj: any ={
    "name":"",
    "email":"",
    "password":"",
  }
  constructor(private http:HttpClient , private router:Router , private cdr:ChangeDetectorRef){}

  onLogin(){
    this.http.post('http://localhost:8080/auth/login' , this.loginObj).subscribe({
      next:(res:any)=>{
        localStorage.setItem('loginToken' , res.token)
        this.router.navigateByUrl('');
      },
      error:(err)=>{
        if(err.status === 401){
          console.log('Invalid Credentials')
        }else{
          console.log('Other error:', err);
        }
      }
    });
  }

  onSignup() {
    this.http.post('http://localhost:8080/users' , this.signupObj).subscribe({
      next:(res:any)=>{
        this.signupObj ={
          "name":"",
          "email":"",
          "password":"",
        }
        this.activeForm = 'login';

        this.cdr.detectChanges();
        console.log('User Created');
      },
      error:(err)=>{
          console.log('Other error:', err);
      }
    });
  }
}
