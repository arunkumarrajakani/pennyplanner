import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSignupComponent } from './expense-signup.component';

describe('ExpenseSignupComponent', () => {
  let component: ExpenseSignupComponent;
  let fixture: ComponentFixture<ExpenseSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseSignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
