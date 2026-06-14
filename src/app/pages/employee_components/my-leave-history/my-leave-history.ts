import { ChangeDetectorRef, Component } from '@angular/core';
import { LeaveService } from '../../../shared/Leave-Services/leave-service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveDayType } from '../../../shared/Leave-Services/leave-day-type-service';
import { LeaveDayService } from '../../../shared/Leave-Services/leave-type-service';
import { LeaveObject } from '../../../interfaces/leave-object';

@Component({
  selector: 'app-my-leave-history',
  imports: [AsyncPipe ,RouterLinkWithHref , ReactiveFormsModule , CommonModule],
  templateUrl: './my-leave-history.html',
  styleUrl: './my-leave-history.css',
})
export class MyLeaveHistory {
  leave_type:'single'|'multi' = 'single';
  leaveTypes$!:Observable<any>
  form!: FormGroup
  toastTimer:any
  formPopulateData: any
  leaveDayTypes$!: Observable<any>
  private refreshLeaves$ = new BehaviorSubject<void>(undefined);
  leaves$: Observable<any> = this.refreshLeaves$.pipe(switchMap(()=>this.leaveService.getLeaves()))
  leaveObj :LeaveObject = {
    leaveType: 0,
    from_date: '',
    to_date: '',
    from_date_type: 0,
    to_date_type: 0,
    reason: ''
  }
  

  constructor(private leaveService:LeaveService , private fb:FormBuilder , private leaveDayType:LeaveDayType , private leaveTypeService:LeaveDayService , private cdr: ChangeDetectorRef){}

  getLeaves(){
    //this.leaves$ = this.leaveService.getLeaves()
    //this.cdr.detectChanges();
    this.refreshLeaves$.next();
  }

  getLeaveDayTypes(){
    this.leaveDayTypes$ = this.leaveDayType.getLeaveDayTypes()
  }
  getLeaveTypes(){
    this.leaveTypes$ = this.leaveTypeService.getLeaveTypes()
  }

  ngOnInit(){
    this.formBuild()
    this.getLeaveTypes()
    this.getLeaveDayTypes()
    this.getLeaves()
  }

  formBuild(){
    if(this.leave_type == 'multi'){
      this.form = this.fb.group({
        leave_id:[],
        leaveType: ['',Validators.required],
        duration: ['multi'],
        single_date: [''],
        single_date_type: [''],
        multi_day_start_date: ['' , Validators.required],
        multi_day_end_date: ['' , Validators.required],
        multi_date_start_type: ['' , Validators.required],
        multi_date_end_type: ['' ,Validators.required],
        reason: ['']
      });
    }else{
      this.form = this.fb.group({
        leave_id:[],
        leaveType: ['',Validators.required],
        duration: ['single'],
        single_date: ['' , Validators.required],
        single_date_type: ['' , Validators.required],
        multi_day_start_date: [''],
        multi_day_end_date: [''],
        multi_date_start_type: [''],
        multi_date_end_type: [''],
        reason: ['']
      });
    }
  }

  selectDuration(type:'single'|'multi'){
    if (this.formPopulateData === null) {
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
      return
    }



    this.leave_type = type;
    this.formBuild()
    const startDate = this.formPopulateData.from_date ? this.formPopulateData.from_date.split('T')[0] : '';
    const endDate = this.formPopulateData.to_date ? this.formPopulateData.to_date.split('T')[0] : '';

    // Only patch values that match the currently selected tab mode
    if (type === 'single') {
      this.form.patchValue({
        leave_id: this.formPopulateData.id,
        leaveType: this.formPopulateData.leaveTypeId,
        single_date: startDate,
        single_date_type: this.formPopulateData.from_date_type_id, // Fixed potential bug here
        reason: this.form.value.reason || this.formPopulateData.reason // Keeps user edits if they typed something!
      });
    } else {
      this.form.patchValue({
        leave_id: this.formPopulateData.id,
        leaveType: this.formPopulateData.leaveTypeId,
        multi_day_start_date: startDate,
        multi_day_end_date: endDate,
        multi_date_start_type: this.formPopulateData.from_date_type_id,
        multi_date_end_type: this.formPopulateData.to_date_type_id,
        reason: this.form.value.reason || this.formPopulateData.reason // Keeps user edits if they typed something!
      });
    }
      
  }

  open_edit(formData:any){
    this.formPopulateData = formData
    const startDate = formData.from_date ? formData.from_date.split('T')[0] : '';
    const endDate = formData.to_date ? formData.to_date.split('T')[0] : '';
      
    if(startDate == endDate){
      this.leave_type = 'single';
      this.formBuild();
      this.form.patchValue({
        leave_id: formData.id,
        leaveType: formData.leaveTypeId,
        single_date: startDate,
        single_date_type: formData.from_date_type_id, 
        reason: formData.reason
      });
    }else{
      this.leave_type = 'multi';
      this.formBuild();
      this.form.patchValue({
          leave_id: formData.id,
          leaveType: formData.leaveTypeId,
          multi_day_start_date: startDate,
          multi_day_end_date: endDate,
          multi_date_start_type: formData.from_date_type_id, 
          multi_date_end_type: formData.to_date_type_id,     
          reason: formData.reason
      });
    }
      
  
  }

  onSubmit() {
    console.log(this.form);
    if(this.form.invalid){Object.keys(this.form.controls).forEach(key => {
      const controlErrors = this.form.get(key)?.errors;
      if (controlErrors != null) {
        console.log('Key control: ' + key + ', errors: ', controlErrors);
      }
    });
      this.form.markAllAsTouched()
      return
    }
    const leaveId = this.form.get('leave_id')?.value;
    this.leaveObj.leaveType = this.form.get('leaveType')?.value;
    this.leaveObj.reason = this.form.get('reason')?.value;
    if(this.leave_type == 'single'){
      this.leaveObj.from_date = this.form.get('single_date')?.value;
      this.leaveObj.from_date_type = this.form.get('single_date_type')?.value;
      this.leaveObj.to_date = this.leaveObj.from_date
      this.leaveObj.to_date_type = this.leaveObj.from_date_type
    }else{
      this.leaveObj.from_date = this.form.get('multi_day_start_date')?.value;
      this.leaveObj.from_date_type = this.form.get('multi_date_start_type')?.value;
      this.leaveObj.to_date = this.form.get('multi_day_end_date')?.value;
      this.leaveObj.to_date_type = this.form.get('multi_date_end_type')?.value;
    }
    this.leaveService.updateLeaves(this.leaveObj , leaveId).subscribe({
      next: (res) => {
        this.getLeaves()
        this.showToast('✅ Leave request updated! Your supervisor has been notified.'); 
      },
      error: (err) => {
        this.showToast('❌ Error occured '+ err.error.error);
      }
    });

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
