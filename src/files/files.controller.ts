import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';



@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }


  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage(
      {
        destination: './static/products',
        filename: fileNamer
      }
    )
  }))
  UploadFile(@UploadedFile() file: Express.Multer.File) {

    if (!file) return new BadRequestException('File Empty')

    console.log(file)


    const secureUrl = `${this.configService.get('HOST_API')}files/product/${file.filename}`


    return { secureUrl }
  }

  @Get('product/:imageName')
  async findOneImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName)

    return res.sendFile(path)


  }

}
