import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('loginToken');

  if(token){
    const colnedReq = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`
      }
    })

    return next(colnedReq)
  }
  return next(req);
};
