import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageChangeProjectComponent } from './language-change-project.component';

describe('LanguageChangeProjectComponent', () => {
  let component: LanguageChangeProjectComponent;
  let fixture: ComponentFixture<LanguageChangeProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageChangeProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageChangeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
