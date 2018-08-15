import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { CommentPage } from '../comment/comment';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {

  loading: boolean;
  posts: any;

  constructor(public navCtrl: NavController,private apollo: Apollo) {}

  ngOnInit(){
    this.apollo
      .query({
        query: gql`
        {
          posts{
            image_url
            description
            likes
            user{
              id
              username
              avatar
            }
            comments{
              id
            }
          }
        }
        `,
      })
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        let inner_posts: any = data;
        this.posts = inner_posts.posts;
      });
  }

  public toProfilePage(){
    this.navCtrl.push(ProfilePage);
  }
  
  public toCommentSection(){
    this.navCtrl.push(CommentPage);
  }

  public likePost(){
    // this.post_num_likes += 1;
  }
}
