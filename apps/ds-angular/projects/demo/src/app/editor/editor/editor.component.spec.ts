import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsModule } from '../../../../../ds/src/public-api';
import { EditorRowComponent } from '../editor-row/editor-row.component';

import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsModule],
      declarations: [EditorRowComponent, EditorComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
