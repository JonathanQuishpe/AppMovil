import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailRewardPage } from './detail-reward.page';

describe('DetailRewardPage', () => {
  let component: DetailRewardPage;
  let fixture: ComponentFixture<DetailRewardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRewardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailRewardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
