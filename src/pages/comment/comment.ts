import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HttpClient } from '@angular/common/http';
import { PusherServiceProvider } from '../../providers/pusher-service/pusher-service';

const makeComment = gql`
  mutation createComment($message: String, $postedAt: DateTime!, $user: UserCreateOneWithoutCommentsInput!,
	$post: PostCreateOneWithoutCommentsInput!){
    createComment(data: {message: $message, postedAt: $postedAt, user: $user, post: $post}){
      id
      message
      user {
        avatar
        username
      }
    }
  }
`;

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html'
})
export class CommentPage {
  comments: any;
  username: string;
  post_desc: string;
  user_avatar: string;
  post_id: string;

  user_comment: string = "";
  comment_channel: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apollo: Apollo,
    public alertCtrl: AlertController,
    public http: HttpClient,
    private pusher: PusherServiceProvider
  ) {
    this.post_id = this.navParams.get('post_id');
    this.username = this.navParams.get('username');
    this.user_avatar = this.navParams.get('avatar');
    this.post_desc = this.navParams.get('post_desc');
    this.loadComments(this.post_id);

    this.initializeRealtimeComments();
  }

  initializeRealtimeComments() {
    this.comment_channel = this.pusher.commentChannel();

    let self = this;
    this.comment_channel.bind('new-comment', function (data) {
      console.log('data is below' + JSON.stringify(data.comment));
      let comment_copy = self.comments;
      self.comments = comment_copy.concat(data.comment);;
    })
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

  public postComment() {
    this.apollo.mutate({
      mutation: makeComment,
      variables: {
        message: this.user_comment,
        postedAt: (new Date()).toISOString(),
        user: { connect: { id: "USER_ID_OBTAINED_FROM_GRAPHQL_SERVER" } },
        post: { connect: { id: this.post_id } }
      }
    }).subscribe((data) => {
      let post_response: any = data;
      // after successful upload, trigger new comment event
      this.http.post('localhost:3128/trigger-comment-event', post_response.data.createComment)
        .subscribe(() => {
          this.showAlert('Success', 'Comment posted successfully');
        });
    }, (error) => {
      this.showAlert('Error', 'Error posting comment');
    });
  }

  public showAlert(title: string, subTitle: string) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }
}