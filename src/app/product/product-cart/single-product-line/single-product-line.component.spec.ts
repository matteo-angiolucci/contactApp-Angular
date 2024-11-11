import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProductLineComponent } from './single-product-line.component';

describe('SingleProductLineComponent', () => {
  let component: SingleProductLineComponent;
  let fixture: ComponentFixture<SingleProductLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleProductLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleProductLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
