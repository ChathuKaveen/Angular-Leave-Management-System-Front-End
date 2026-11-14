import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../../shared/Leave-Services/leave-service';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-pending-requests',
  imports: [JsonPipe , AsyncPipe],
  templateUrl: './pending-requests.html',
  styleUrl: './pending-requests.css',
})
export class PendingRequests implements OnInit {
  subLeaves$!: Observable<any>;
  pendingCount$!: Observable<number>;

  toastTimer:any
  constructor(private leaveSer:LeaveService){
    this.subLeaves$ = this.leaveSer.refreshSubordinates$.pipe(
      switchMap(() => this.leaveSer.getLeavesOfSubordinates())
    );
    this.pendingCount$ = this.subLeaves$.pipe(
      map((leaves: any[]) => leaves.filter(l => l.status === 'PENDING').length)
    );
  }

  getLeaveDayTypes(){
    this.leaveSer.refreshSubordinates$.next();
  }
  
  ngOnInit(): void {
      this.getLeaveDayTypes();
  }

  approve(id:number){
    this.leaveSer.approveLeaves({"status":"APPROVED"} , id).subscribe({
      next:(res)=>{
        this.getLeaveDayTypes()
        this.showToast('✅ Leave approved! Sara has been notified.'+id)
      },
      error:(e)=>{
        this.getLeaveDayTypes()
        this.showToast('❌ '+ e)
      }   
    });
    
  }

  reject(id:number){
    this.leaveSer.approveLeaves({"status":"REJECTED"} , id).subscribe({
      next:(res)=>{
        this.getLeaveDayTypes()
        this.showToast('❌ Leave rejected. Sara has been notified.'+id)
      },
      error:(e)=>{
        this.getLeaveDayTypes()
        this.showToast('❌ '+ e)
      }   
    });;
    
  }

  showToast(msg:any) {
    const t:HTMLElement | null = document.getElementById('toast')
    if(t != null){
      t.textContent = msg;
      t.style.transform = 'translateY(0)';
      t.style.opacity = '1';
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
                          t.style.transform = 'translateY(80px)';
                          t.style.opacity = '0';
                        }, 3000);
    }
    
  }
}
