import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Apollo } from 'apollo-angular';
import  gql from 'graphql-tag';
import pluralize from 'pluralize';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,  private apollo: Apollo) {
  }

  ngOnInit(){
    this.fetchProfile( this.navParams.get('id'));
  }


  fetchProfile(user_id: string){
    this.apollo
      .query({
        query: gql`
        {
          user(where: {id: "${user_id}"}){
            id
            username
            fullname
            avatar
            bio
            followers
            following
            posts{
              image_url
            }
          }
        }
        `,
      })
      .subscribe(({ data }) => {
        let result:any = data;
        this.user = result.user;
      });
  }

  plural(word, number){
    return pluralize(word, number);
  }
}
