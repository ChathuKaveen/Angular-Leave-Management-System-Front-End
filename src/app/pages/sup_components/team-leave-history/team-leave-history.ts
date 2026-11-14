import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../../shared/Leave-Services/leave-service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-leave-history',
  imports: [AsyncPipe, DatePipe, FormsModule],
  templateUrl: './team-leave-history.html',
  styleUrl: './team-leave-history.css',
})
export class TeamLeaveHistory implements OnInit {

  private refresh$ = new BehaviorSubject<void>(undefined);

  // Filter state
  selectedMember: string = '';
  selectedStatus: string = '';
  selectedMonth: string = '';

  // All subordinate leaves
  private allLeaves$: Observable<any[]> = this.refresh$.pipe(
    switchMap(() => this.leaveSer.getLeavesOfSubordinates()),
    map((leaves: any) => leaves as any[])
  );

  // Distinct member names for the dropdown
  memberNames$: Observable<string[]> = this.allLeaves$.pipe(
    map(leaves => [...new Set<string>(leaves.map((l: any) => l.userName))].sort())
  );

  // Filtered history (APPROVED + REJECTED only)
  history$: Observable<any[]> = combineLatest([
    this.allLeaves$,
    new BehaviorSubject<void>(undefined)   // placeholder; actual filter via template bindings below
  ]).pipe(
    map(([leaves]) => leaves.filter((l: any) => l.status === 'APPROVED' || l.status === 'REJECTED'))
  );

  // We'll derive filtered list each time filters change — driven by a filter trigger
  private filterTrigger$ = new BehaviorSubject<void>(undefined);

  filteredHistory$: Observable<any[]> = combineLatest([this.allLeaves$, this.filterTrigger$]).pipe(
    map(([leaves]) => {
      return leaves.filter((l: any) => {
        const isHistory = l.status === 'APPROVED' || l.status === 'REJECTED';
        const matchMember = !this.selectedMember || l.userName === this.selectedMember;
        const matchStatus = !this.selectedStatus || l.status === this.selectedStatus.toUpperCase();
        const matchMonth = !this.selectedMonth ||
          (l.from_date && l.from_date.slice(0, 7) === this.selectedMonth);
        return isHistory && matchMember && matchStatus && matchMonth;
      });
    })
  );

  constructor(private leaveSer: LeaveService) {}

  ngOnInit(): void {
    this.refresh$.next();
  }

  applyFilters(): void {
    this.filterTrigger$.next();
  }

  refresh(): void {
    this.refresh$.next();
    this.filterTrigger$.next();
  }

  getStatusClass(status: string): string {
    if (status === 'APPROVED') return 'badge-approved';
    if (status === 'REJECTED') return 'badge-rejected';
    return 'badge-pending';
  }
}
