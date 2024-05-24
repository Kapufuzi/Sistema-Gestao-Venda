import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootNavComponent } from './root-nav.component';

describe('RootNavComponent', () => {
  let component: RootNavComponent;
  let fixture: ComponentFixture<RootNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RootNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RootNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
