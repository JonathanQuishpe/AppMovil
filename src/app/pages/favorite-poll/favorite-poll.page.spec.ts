import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FavoritePollPage } from './favorite-poll.page';

describe('FavoritePollPage', () => {
  let component: FavoritePollPage;
  let fixture: ComponentFixture<FavoritePollPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritePollPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritePollPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
