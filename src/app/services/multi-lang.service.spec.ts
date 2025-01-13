import { TestBed } from '@angular/core/testing';

import { MultiLangService } from './multi-lang.service';

describe('MultiLangService', () => {
  let service: MultiLangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiLangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
