import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabPollsPage } from './tab-polls.page';

describe('TabPollsPage', () => {
  let component: TabPollsPage;
  let fixture: ComponentFixture<TabPollsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPollsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabPollsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
