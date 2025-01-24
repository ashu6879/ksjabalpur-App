import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllBuildersPage } from './all-builders.page';

describe('AllBuildersPage', () => {
  let component: AllBuildersPage;
  let fixture: ComponentFixture<AllBuildersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBuildersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
