import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginSocialPage } from './login-social.page';

describe('LoginSocialPage', () => {
  let component: LoginSocialPage;
  let fixture: ComponentFixture<LoginSocialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSocialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginSocialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
