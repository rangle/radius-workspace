import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorRowComponent } from './editor-row.component';

describe('EditorRowComponent', () => {
  let component: EditorRowComponent;
  let fixture: ComponentFixture<EditorRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorRowComponent ]
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
