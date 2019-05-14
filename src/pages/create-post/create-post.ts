import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HomePage } from '../home/home';
import { HttpClient } from '@angular/common/http';

declare var cloudinary;

// mutation to create a new post
const createUserPost = gql`
  mutation createPost($image_url: String!, $description: String, $likes: Int, $postedAt: DateTime!,
  $user: UserCreateOneWithoutPostsInput!){
    createPost(data: {image_url: $image_url, description: $description, likes: $likes, postedAt: $postedAt, user: $user}){
      id
      image_url
      description
      likes
      user{
        id
        username
        avatar
      }
      comments {
        id
      }
    }
  }
`;

@IonicPage()
@Component({
  selector: 'page-create-post',
  templateUrl: 'create-post.html',
})
export class CreatePostPage {
  user_id: string;
  uploadWidget: any;
  posted_at: string;
  image_url: string;
  description: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apollo: Apollo,
    public alertCtrl: AlertController, public http: HttpClient) {
    // get the user id of the user about to make post
    this.user_id = this.navParams.get('user_id');

    let self = this; // assign this to another variable to be used withing another class
    this.uploadWidget = cloudinary.createUploadWidget({
      cloudName: 'CLOUDINARY_CLOUD_NAME',
      uploadPreset: 'CLODUINARY_UPLOAD_PRESET',
    }, (error, result) => {
      if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', JSON.stringify(result.info));
        // image link
        self.posted_at = result.info.created_at;
        self.image_url = result.info.secure_url;
        self.uploadPost();
      }
    })
  }

  public uploadPost() {
    this.apollo.mutate({
      mutation: createUserPost,
      variables: {
        image_url: this.image_url,
        description: this.description,
        likes: 10,
        postedAt: this.posted_at,
        user: { "connect": { "id": this.user_id } }
      }
    }).subscribe((data) => {
      console.log('uploaded successfuly');
      // after sucessful upload, trigger pusher event
      let post_response: any = data;
      this.http.post('http://localhost:3128/trigger-post-event', post_response.data.createPost)
        .subscribe(() => {
          this.showAlert('Post Shared', 'Your post has been shared with other users');
          this.navCtrl.push(HomePage);
        });
    }, (error) => {
      this.showAlert('Error', 'There was an error sharing your post, please retry');
      console.log('there was an error sending :the query', error);
    })
  }

  public showAlert(title: string, subTitle: string) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  public loadWidget() {
    this.uploadWidget.open();
  }
}
