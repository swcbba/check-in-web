import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { VolunteersService } from '../../volunteers/volunteers.service';
import { MeetingsService } from '../meetings.service';
import { Volunteer } from '../../volunteers/volunteer';

const SearcherId = '#searcher';
declare const $: any;

@Component({
  selector: 'sw-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  volunteers: Array<Volunteer>;
  isFilteredByAssistants: boolean;
  private meetingId: string;

  constructor(
    private volunteersService: VolunteersService,
    private meetingsService: MeetingsService,
    private route: ActivatedRoute
  ) {
    this.isFilteredByAssistants = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.meetingId = params['id'];
      this.meetingsService.getMeeting(this.meetingId).subscribe(meeting => {
        if (meeting) {
          this.volunteersService
            .getVolunteers()
            .pipe(
              map(volunteers => {
                volunteers.forEach(volunteer => {
                  volunteer.attendedTheMeeting = false;
                });
                return volunteers;
              })
            )
            .subscribe(volunteers => {
              this.volunteers = volunteers;
              this.initializeSearcher();
              this.getMeetingAssistants();
            });
        }
      });
    });
  }

  checkFilteredView(volunteer: Volunteer): boolean {
    return (
      (volunteer.attendedTheMeeting && this.isFilteredByAssistants) ||
      (!volunteer.attendedTheMeeting && !this.isFilteredByAssistants)
    );
  }

  deleteAssistant(volunteer: Volunteer): void {
    volunteer.attendedTheMeeting = false;
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
        setTimeout(_ => {
          $(SearcherId).val('');
        }, 10);
        this.meetingsService.setMeetingAssistant(this.meetingId, volunteer.id);
      }
    });
  }

  private getMeetingAssistants(): void {
    this.meetingsService
      .getMeetingAssistantsByMeeting(this.meetingId)
      .subscribe(meetingAssistants => {
        meetingAssistants.forEach(meetingAssistant => {
          const volunteerIndex: number = this.volunteers.findIndex(
            volunteer => volunteer.id === meetingAssistant.volunteerId
          );
          if (this.volunteers[volunteerIndex]) {
            this.volunteers[volunteerIndex].attendedTheMeeting = true;
          }
        });
      });
  }
}
