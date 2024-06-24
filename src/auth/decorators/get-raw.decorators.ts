import { createParamDecorator } from "@nestjs/common";

export const GetRowRequest = createParamDecorator((data = [], res) => { 
    const request = res.switchToHttp().getRequest();
    return request.rawHeaders;
});