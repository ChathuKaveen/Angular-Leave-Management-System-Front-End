import { AbstractControl, ValidationErrors } from "@angular/forms";

export function noPastDate(control:AbstractControl): ValidationErrors | null{
    
    if(!control.value) return null;

    const selected = new Date(control.value)
    const today = new Date()
    today.setHours(0,0,0,0)

    return selected < today ? {pastDate:true} : null;
}

export function noPastMultiDates(control:AbstractControl): ValidationErrors | null{
    const start = control.get('multi_day_start_date')?.value
    const end = control.get('multi_day_end_date')?.value

    if(!start || !end) return null
    const start_date = new Date(start)
    const end_date = new Date(end)
    const today = new Date()
    today.setHours(0,0,0,0)
    start_date.setHours(0,0,0,0)
    end_date.setHours(0,0,0,0)
    if(start_date < today){
        return {startPast:true}
    }
    if(end_date <= start_date){
        return {invalidRange:true}
    }
    return null;
}