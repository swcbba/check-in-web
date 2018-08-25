import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VolunteersService } from '../../volunteers/volunteers.service';
import { MeetingsService } from '../meetings.service';
import { IVolunteer } from '../../volunteers/i-volunteer';

declare const $: any;

@Component({
  selector: 'sw-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  isFilteredByAssitants: boolean;
  volunteers: Array<IVolunteer>;
  private meetingId: string;

  constructor(
    private volunteersService: VolunteersService,
    private meetingsService: MeetingsService,
    private route: ActivatedRoute
  ) {
    this.isFilteredByAssitants = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.meetingId = params['id'];
      this.meetingsService.getMeeting(this.meetingId).subscribe(meeting => {
        if (meeting) {
          this.volunteersService.getVolunteers().subscribe(volunteers => {
            this.volunteers = volunteers;
            volunteers.forEach(volunteer => {
              volunteer.attendedToMeeting = false;
            });
            this.getMeetingAssistants();
            this.initializeSearcher();
          });
        }
      });
    });
  }

  deleteAssistant(volunteer: IVolunteer): void {
    volunteer.attendedToMeeting = false;
    this.meetingsService.deleteMeetingAssistant(this.meetingId, volunteer.id);
  }

  private initializeSearcher(): void {
    $('.ui.search').search({
      source: this.volunteers,
      searchFields: ['name', 'email', 'team'],
      fields: {
        title: 'name'
      },
      onSelect: volunteer => {
        setTimeout(() => {
          $('#searcher').val('');
        }, 1);
        this.meetingsService.setMeetingAssistant(this.meetingId, volunteer.id);
      }
    });
  }

  private getMeetingAssistants(): void {
    this.meetingsService
      .getMeetingAssistantsByMeeting(this.meetingId)
      .subscribe(meetingAssistants => {
        meetingAssistants.forEach(meetingAssistant => {
          let volunteerIndex = this.volunteers.findIndex(
            volunteer => volunteer.id === meetingAssistant.volunteerId
          );
          if (this.volunteers[volunteerIndex]) {
            this.volunteers[volunteerIndex].attendedToMeeting = true;
          }
        });
      });
  }

  private filterAttendees(event: HTMLButtonElement): void {
    this.isFilteredByAssitants = event.innerText == 'asistentes';
  }

  private checkFilteredView(volunteer: IVolunteer): boolean {
    return (volunteer.attendedToMeeting && this.isFilteredByAssitants) ||
      (!volunteer.attendedToMeeting && !this.isFilteredByAssitants);
  }
}
