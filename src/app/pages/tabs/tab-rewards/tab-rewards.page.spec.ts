import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabRewardsPage } from './tab-rewards.page';

describe('TabRewardsPage', () => {
  let component: TabRewardsPage;
  let fixture: ComponentFixture<TabRewardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabRewardsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabRewardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
