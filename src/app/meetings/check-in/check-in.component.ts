import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VolunteersService } from '../../volunteers/volunteers.service';
import { MeetingsService } from '../meetings.service';
import { IVolunteer } from '../../volunteers/i-volunteer';

const SearcherId: string = '#searcher';
declare const $: any;

@Component({
  selector: 'sw-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  assistants: Array<IVolunteer>;
  private volunteers: Array<IVolunteer>;
  private meetingId: string;

  constructor(
    private volunteersService: VolunteersService,
    private meetingsService: MeetingsService,
    private route: ActivatedRoute
  ) {
    this.assistants = new Array();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.meetingId = params['id'];
      this.meetingsService.getMeeting(this.meetingId).subscribe(meeting => {
        if (meeting) {
          this.volunteersService.getVolunteers().subscribe(volunteers => {
            this.volunteers = volunteers;
            this.getMeetingAssistants();
            this.initializeSearcher();
          });
        }
      });
    });
  }

  deleteAssistant(volunteerId: string): void {
    this.meetingsService.deleteMeetingAssistant(this.meetingId, volunteerId);
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
          $(SearcherId).val('');
        }, 1);
        this.meetingsService.setMeetingAssistant(this.meetingId, volunteer.id);
      }
    });
  }

  private getMeetingAssistants(): void {
    this.meetingsService
      .getMeetingAssistantsByMeeting(this.meetingId)
      .subscribe(meetingAssistants => {
        this.assistants = new Array();
        meetingAssistants.forEach(meetingAssistant => {
          let volunteer = this.volunteers.find(
            volunteer => volunteer.id === meetingAssistant.volunteerId
          );
          if (volunteer) {
            this.assistants.push(volunteer);
          }
        });
      });
  }
}
