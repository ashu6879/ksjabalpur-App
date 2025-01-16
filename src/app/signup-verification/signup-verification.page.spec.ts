import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupVerificationPage } from './signup-verification.page';

describe('SignupVerificationPage', () => {
  let component: SignupVerificationPage;
  let fixture: ComponentFixture<SignupVerificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
