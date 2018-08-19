import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { CommentPage } from '../comment/comment';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  entryComponents: [ProfilePage, CommentPage]
})
export class HomePage implements OnInit {
  loading: boolean;
  posts: any;

  constructor(public navCtrl: NavController, private apollo: Apollo) {
    this.fetchPosts();
  }

  fetchPosts() {
    this.apollo
      .query({
        query: gql`
          {
            posts {
              id
              image_url
              description
              likes
              user {
                id
                username
                avatar
              }
              comments {
                id
              }
            }
          }
        `
      })
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        let inner_posts: any = data;
        this.posts = inner_posts.posts;
      });
  }
  ngOnInit() {}

  public toProfilePage(user_id: string) {
    let nav_params = new NavParams({ id: user_id });
    this.navCtrl.push(ProfilePage, nav_params);
  }

  public toCommentSection(post_data: any) {
    let nav_params = new NavParams({
      post_id: post_data.id,
      username: post_data.user.username,
      avatar: post_data.user.avatar,
      post_desc: post_data.description
    });
    console.log(nav_params.data);
    this.navCtrl.push(CommentPage, nav_params);
  }

  public likePost() {
    // this.post_num_likes += 1;
  }
}
