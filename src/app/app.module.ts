import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { firebaseConfig } from '../environments/firebase-configure';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  bootstrap: []
})
export class AppModule {}
