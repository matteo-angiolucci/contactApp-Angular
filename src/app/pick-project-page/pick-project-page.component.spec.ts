import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickProjectPageComponent } from './pick-project-page.component';

describe('PickProjectPageComponent', () => {
  let component: PickProjectPageComponent;
  let fixture: ComponentFixture<PickProjectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickProjectPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
