import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tardanzas } from './tardanzas';

describe('Tardanza', () => {
  let component: Tardanzas;
  let fixture: ComponentFixture<Tardanzas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tardanzas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tardanzas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
