import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsModule } from '../../../../../ds/src/public-api';
import { ListItemComponent } from '../list-item/list-item.component';
import { ListComponent } from '../list/list.component';

import { MoviesComponent } from './movies.component';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsModule],
      declarations: [ListComponent, ListItemComponent, MoviesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
