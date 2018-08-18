import { TestBed, inject } from '@angular/core/testing';

import { VolunteersService } from './volunteers.service';

describe('VolunteersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VolunteersService]
    });
  });

  it('should be created', inject([VolunteersService], (service: VolunteersService) => {
    expect(service).toBeTruthy();
  }));
});
