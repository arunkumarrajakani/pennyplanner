import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDetailedInfoComponent } from './expense-detailed-info.component';

describe('ExpenseDetailedInfoComponent', () => {
  let component: ExpenseDetailedInfoComponent;
  let fixture: ComponentFixture<ExpenseDetailedInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseDetailedInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseDetailedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
