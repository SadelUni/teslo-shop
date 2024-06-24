import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { firebaseConfig } from './firebase.config';
import * as admin from 'firebase-admin';
import { join } from 'path';


@Global()
@Module({
  providers: [FirebaseService],


  controllers: [FirebaseController],
  //exports: ['FIREBASE_ADMIN']

})
export class FirebaseModule { }
