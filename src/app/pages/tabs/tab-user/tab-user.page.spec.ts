import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabUserPage } from './tab-user.page';

describe('TabUserPage', () => {
  let component: TabUserPage;
  let fixture: ComponentFixture<TabUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabUserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
