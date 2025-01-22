import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommercialPropertiesPage } from './commercial-properties.page';

describe('CommercialPropertiesPage', () => {
  let component: CommercialPropertiesPage;
  let fixture: ComponentFixture<CommercialPropertiesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialPropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
