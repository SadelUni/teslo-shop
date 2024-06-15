import { Request,Express } from 'express';


export const fileFilter = (req: Request, file: Express.Multer.File, callBack: Function) => {
    console.log(file)

    if(!file) return callBack(new Error('File Empty'), false)

    
    const fileExt = file.mimetype.split('/')[1]
    const allowedExt = ['png', 'jpg', 'jpeg', 'pdf']

    if(allowedExt.includes(fileExt)) return callBack(null, true)




}