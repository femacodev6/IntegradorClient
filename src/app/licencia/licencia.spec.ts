import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Licencia } from './licencia';

describe('Licencia', () => {
  let component: Licencia;
  let fixture: ComponentFixture<Licencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Licencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Licencia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
