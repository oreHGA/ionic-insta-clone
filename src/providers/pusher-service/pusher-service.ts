import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';

/*
  Generated class for the PusherServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PusherServiceProvider {
  pusher: any;

  constructor(public http: HttpClient) {
    this.pusher = new Pusher('PUSHER_APP_KEY', {
      cluster: 'mt1',
      forceTLS: true
    });
  }

  postChannel() {
    return this.pusher.subscribe('post-channel');
  }

  commentChannel() {
    return this.pusher.subscribe('comment-channel');
  }
}
