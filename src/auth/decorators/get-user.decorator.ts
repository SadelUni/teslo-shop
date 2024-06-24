import { InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator((data = [], res) => {
    let newUserData = {};

    const request = res.switchToHttp().getRequest();



    if (!request.user) {
        throw new InternalServerErrorException("User not found");
    }

    if (data.length === 0) {
        return request.user;
    }

    data.map((param) => {
        newUserData[param] = request.user[param];
    });

    // for (let param of data) {
    //     console.log(param);
    //     console.log(request.user[param]);
    //     newUserData[param] = request.user[param];
    // }





    return data.length > 1 ? newUserData : request.user;

})