import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tardanza } from './tardanza';

describe('Tardanza', () => {
  let component: Tardanza;
  let fixture: ComponentFixture<Tardanza>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tardanza]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tardanza);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
