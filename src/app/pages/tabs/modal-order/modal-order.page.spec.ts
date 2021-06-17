import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalOrderPage } from './modal-order.page';

describe('ModalOrderPage', () => {
  let component: ModalOrderPage;
  let fixture: ComponentFixture<ModalOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
