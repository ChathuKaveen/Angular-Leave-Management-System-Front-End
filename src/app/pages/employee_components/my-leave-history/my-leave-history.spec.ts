import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLeaveHistory } from './my-leave-history';

describe('MyLeaveHistory', () => {
  let component: MyLeaveHistory;
  let fixture: ComponentFixture<MyLeaveHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLeaveHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyLeaveHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
