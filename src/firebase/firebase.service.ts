import { Injectable, Inject } from '@nestjs/common';
import { CreateFirebaseDto } from './dto/create-firebase.dto';
import { UpdateFirebaseDto } from './dto/update-firebase.dto';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';




@Injectable()
export class FirebaseService {
  // private storageFB = admin.storage().bucket();
  constructor(
  //  @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App
  ) { }

  // async create(file: Express.Multer.File): Promise<string> {


  //   const fileName = `image/${file.originalname}`;
  //   const fileUpload = this.storageFB.file(fileName);

  //   try {
  //     await fileUpload.save(file.buffer, {
  //       metadata: {
  //         contentType: file.mimetype,
  //       },
  //     });
  //     const downloadURL = `https://storage.googleapis.com/${this.storageFB.name}/${fileName}`;
  //     console.log('File available at', downloadURL);
  //     return downloadURL;
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     throw error;

  //   }
  // }

  findAll() {
    return `This action returns all firebase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} firebase`;
  }

  update(id: number, updateFirebaseDto: UpdateFirebaseDto) {
    return `This action updates a #${id} firebase`;
  }

  remove(id: number) {
    return `This action removes a #${id} firebase`;
  }
}
