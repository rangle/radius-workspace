import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsModule } from '../../../../../ds/src/public-api';

import { EditorRowComponent } from './editor-row.component';

describe('EditorRowComponent', () => {
  let component: EditorRowComponent;
  let fixture: ComponentFixture<EditorRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsModule],
      declarations: [EditorRowComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
