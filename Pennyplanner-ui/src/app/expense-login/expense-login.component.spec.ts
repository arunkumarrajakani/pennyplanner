import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseLoginComponent } from './expense-login.component';

describe('ExpenseLoginComponent', () => {
  let component: ExpenseLoginComponent;
  let fixture: ComponentFixture<ExpenseLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
