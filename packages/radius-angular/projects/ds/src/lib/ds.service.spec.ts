import { TestBed } from '@angular/core/testing';

import { DsService } from './ds.service';

describe('DsService', () => {
  let service: DsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
