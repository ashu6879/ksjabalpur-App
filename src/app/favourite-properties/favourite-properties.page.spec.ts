import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouritePropertiesPage } from './favourite-properties.page';

describe('FavouritePropertiesPage', () => {
  let component: FavouritePropertiesPage;
  let fixture: ComponentFixture<FavouritePropertiesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritePropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
