import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserCompanyPage } from './user-company.page';

describe('UserCompanyPage', () => {
  let component: UserCompanyPage;
  let fixture: ComponentFixture<UserCompanyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCompanyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
