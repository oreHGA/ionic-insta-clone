import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// import modules for apollo client
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import other pages
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { CommentPage } from '../pages/comment/comment';
import { CreatePostPage } from '../pages/create-post/create-post';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import pusher sevice provider
import { PusherServiceProvider } from '../providers/pusher-service/pusher-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    ProfilePage,
    CommentPage,
    CreatePostPage
  ],
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    ProfilePage,
    CommentPage,
    CreatePostPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PusherServiceProvider
  ]
})

export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({ uri: 'http://localhost:4466' }), // uri specifies the endpoint for our graphql server
      cache: new InMemoryCache()
    })
  }
}
