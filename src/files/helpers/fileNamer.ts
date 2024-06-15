import { Request } from 'express';
import { v4 as uuid } from 'uuid';



export const fileNamer = (req: Request, file: Express.Multer.File, callBack: Function) => {
    console.log(file)

    if(!file) return callBack(new Error('File Empty'), false)

    
    const fileExt = file.mimetype.split('/')[1]
    const allowedExt = ['png', 'jpg', 'jpeg', 'pdf']

    const fileName = `${file.fieldname}-${uuid()}.${fileExt}`

    if(allowedExt.includes(fileExt)) return callBack(null, fileName)




}