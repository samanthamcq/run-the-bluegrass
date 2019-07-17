import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogMyRunComponent } from './log-my-run.component';

describe('LogMyRunComponent', () => {
  let component: LogMyRunComponent;
  let fixture: ComponentFixture<LogMyRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogMyRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogMyRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
