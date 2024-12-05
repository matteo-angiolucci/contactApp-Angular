import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourCardLayoutGridExComponent } from './four-card-layout-grid-ex.component';

describe('FourCardLayoutGridExComponent', () => {
  let component: FourCardLayoutGridExComponent;
  let fixture: ComponentFixture<FourCardLayoutGridExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourCardLayoutGridExComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourCardLayoutGridExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
