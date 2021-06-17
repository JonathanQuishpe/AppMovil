import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabCampaignsPage } from './tab-campaigns.page';

describe('TabCampaignsPage', () => {
  let component: TabCampaignsPage;
  let fixture: ComponentFixture<TabCampaignsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabCampaignsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabCampaignsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
