import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { CommentPage } from '../comment/comment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  post_num_likes = 12;
  constructor(public navCtrl: NavController) {

  }

  public toProfilePage(){
    this.navCtrl.push(ProfilePage);
  }
  
  public toCommentSection(){
    this.navCtrl.push(CommentPage);
  }

  public likePost(){
    this.post_num_likes += 1;
  }
}
