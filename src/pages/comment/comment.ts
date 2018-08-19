import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html'
})
// @ViewChild('myInput') myInput: ElementRef;
export class CommentPage {
  comments: any;
  username: string;
  post_desc: string;
  user_avatar: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apollo: Apollo
  ) {
    // let params = this.navParams.data;
    this.username = this.navParams.get('username');
    this.user_avatar = this.navParams.get('avatar');
    this.post_desc = this.navParams.get('post_desc');
    this.loadComments(this.navParams.get('post_id'));
  }

  loadComments(post_id: string) {
    this.apollo
      .query({
        query: gql`
          {
            comments(where: { post: { id: "${post_id}" } }) {
              id
              message
              user {
                avatar
                username
              }
            }
          }
        `
      })
      .subscribe(({ data }) => {
        let result: any = data;
        this.comments = result.comments;
      });
  }
}
