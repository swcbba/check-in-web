import { VolunteersModule } from './volunteers.module';

describe('VolunteersModule', () => {
  let volunteersModule: VolunteersModule;

  beforeEach(() => {
    volunteersModule = new VolunteersModule();
  });

  it('should create an instance', () => {
    expect(volunteersModule).toBeTruthy();
  });
});
