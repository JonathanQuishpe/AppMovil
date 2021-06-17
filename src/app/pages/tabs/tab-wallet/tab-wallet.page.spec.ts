import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabWalletPage } from './tab-wallet.page';

describe('TabWalletPage', () => {
  let component: TabWalletPage;
  let fixture: ComponentFixture<TabWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabWalletPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
