import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowAllBuildersPage } from './show-all-builders.page';

describe('ShowAllBuildersPage', () => {
  let component: ShowAllBuildersPage;
  let fixture: ComponentFixture<ShowAllBuildersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAllBuildersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
