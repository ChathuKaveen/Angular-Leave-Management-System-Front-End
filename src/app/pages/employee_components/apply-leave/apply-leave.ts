import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from '../../../shared/Leave-Services/leave-service';
import { noPastDate , noPastMultiDates } from '../../../shared/validators/date.validator';
import { LeaveObject } from '../../../interfaces/leave-object';
import { LeaveDayService } from '../../../shared/Leave-Services/leave-type-service';
import { LeaveDayType } from '../../../shared/Leave-Services/leave-day-type-service';
import { AsyncPipe } from '@angular/common';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-apply-leave',
  imports: [ReactiveFormsModule ,AsyncPipe],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.css',
})
export class ApplyLeave implements OnInit{
  leave_type:'single'|'multi' = 'single';
  form!: FormGroup
  toastTimer:any
  leaveObj :LeaveObject = {
    leaveType: 0,
    from_date: '',
    to_date: '',
    from_date_type: 0,
    to_date_type: 0,
    reason: ''
  }
  leaveTypes$!:Observable<any>
  leaveDayTypes$!: Observable<any>
  leaves$!: Observable<any>
  leave_total :Record<string , number>= {
    
  };
  constructor(private fb:FormBuilder , private leaveService:LeaveService , private leaveTypeService:LeaveDayService , private leaveDayType:LeaveDayType){
  }

  formBuild(){
    if(this.leave_type == 'multi'){
      this.form = this.fb.group({
        leaveType: ['',Validators.required],
        duration: ['multi'],
        single_date: [''],
        single_date_type: [''],
        multi_day_start_date: ['' , [Validators.required,noPastDate]],
        multi_day_end_date: ['' , [Validators.required,noPastDate]],
        multi_date_start_type: ['' , Validators.required],
        multi_date_end_type: ['' ,Validators.required],
        reason: ['']
      },{validators: noPastMultiDates});
    }else{
      this.form = this.fb.group({
        leaveType: ['',Validators.required],
        duration: ['single'],
        single_date: ['' , noPastDate],
        single_date_type: ['' , Validators.required],
        multi_day_start_date: [''],
        multi_day_end_date: [''],
        multi_date_start_type: [''],
        multi_date_end_type: [''],
        reason: ['']
      });
    }
  }

  getLeaves(){
    this.leaves$ = this.leaveService.getLeaves()
    this.leaves$.subscribe((leaves: any[]) =>{
      this.leave_total = {}

      leaves.forEach(leave =>{
        if (this.leave_total[leave.leaveType]) {
          this.leave_total[leave.leaveType] += leave.days;
        } else {
          this.leave_total[leave.leaveType] = leave.days;
        }
  
      })
    })
  }

  getLeaveCount(type: string): number {
    const key = Object.keys(this.leave_total).find(k =>
      k.toLowerCase().includes(type.toLowerCase())
    );
    return key ? this.leave_total[key] : 0;
  }

  getLeaveTypes(){
    this.leaveTypes$ = this.leaveTypeService.getLeaveTypes()
  }

  getLeaveDayTypes(){
    this.leaveDayTypes$ = this.leaveDayType.getLeaveDayTypes()
  }

  ngOnInit(){
    this.formBuild()
    this.getLeaveDayTypes()
    this.getLeaveTypes()
    this.getLeaves()
  }

  onSubmit() {
    if(this.form.invalid){
      this.form.markAllAsTouched()
      return
    }
    this.leaveObj.leaveType = this.form.get('leaveType')?.value;
    this.leaveObj.reason = this.form.get('reason')?.value;
    if(this.leave_type == 'single'){
      this.leaveObj.from_date = this.form.get('single_date')?.value;
      this.leaveObj.from_date_type = this.form.get('single_date_type')?.value;
    }else{
      this.leaveObj.from_date = this.form.get('multi_day_start_date')?.value;
      this.leaveObj.from_date_type = this.form.get('multi_date_start_type')?.value;
      this.leaveObj.to_date = this.form.get('multi_day_end_date')?.value;
      this.leaveObj.to_date_type = this.form.get('multi_date_end_type')?.value;
    }
    this.leaveService.addLeave(this.leaveObj).subscribe({
      next: (res) => {
        console.log(res);
        this.getLeaves();
        this.showToast('✅ Leave request submitted! Your supervisor has been notified.');
      },
      error: (err) => {
        this.showToast('❌ Error occured '+ err);
      }
    });
    console.log(this.leaveObj);
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

  selectDuration(type:'single'|'multi'){
    this.formBuild()
    if (type === 'single') {
      this.form.patchValue({
        single_date:''
      });
    } else {
      this.form.patchValue({
        multi_day_start_date: '',
        multi_day_end_date: ''
      });
    }
    this.leave_type = type;
  }
}
