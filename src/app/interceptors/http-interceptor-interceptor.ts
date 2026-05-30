import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err)=>{
      if(err.status  === 401){
        console.log('Unauthorized');
      }else if(err.status === 403){
        console.log('Forbidden')
      }else if(err.status === 500){
        console.log('Server error');
      }

      return throwError(()=>err);
    })
  )
};
