import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartSlidePage } from './start-slide.page';

describe('StartSlidePage', () => {
  let component: StartSlidePage;
  let fixture: ComponentFixture<StartSlidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartSlidePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartSlidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
