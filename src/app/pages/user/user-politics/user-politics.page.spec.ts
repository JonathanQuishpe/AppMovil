import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserPoliticsPage } from './user-politics.page';

describe('UserPoliticsPage', () => {
  let component: UserPoliticsPage;
  let fixture: ComponentFixture<UserPoliticsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPoliticsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPoliticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
