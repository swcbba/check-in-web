import { MeetingsModule } from './meetings.module';

describe('MeetingsModule', () => {
  let meetingsModule: MeetingsModule;

  beforeEach(() => {
    meetingsModule = new MeetingsModule();
  });

  it('should create an instance', () => {
    expect(meetingsModule).toBeTruthy();
  });
});
