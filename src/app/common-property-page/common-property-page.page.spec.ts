import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonPropertyPagePage } from './common-property-page.page';

describe('CommonPropertyPagePage', () => {
  let component: CommonPropertyPagePage;
  let fixture: ComponentFixture<CommonPropertyPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPropertyPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
