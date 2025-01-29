import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowAllCommonPropertiesPage } from './show-all-common-properties.page';

describe('ShowAllCommonPropertiesPage', () => {
  let component: ShowAllCommonPropertiesPage;
  let fixture: ComponentFixture<ShowAllCommonPropertiesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAllCommonPropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
