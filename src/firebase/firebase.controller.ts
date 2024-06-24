import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from './firebase.service';
import { CreateFirebaseDto } from './dto/create-firebase.dto';
import { UpdateFirebaseDto } from './dto/update-firebase.dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) { }

  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   // Subir el archivo a Firebase Storage


  //   const result = this.firebaseService.create(file);
  //   console.log(result);

  //   return { result };


  //   // Aquí puedes retornar la URL del archivo subido, enviar una respuesta al cliente, etc.
  //   //return { url: uploadedFileUrl };
  // }
  @Get()
  findAll() {
    return this.firebaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.firebaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFirebaseDto: UpdateFirebaseDto) {
    return this.firebaseService.update(+id, updateFirebaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.firebaseService.remove(+id);
  }
}
