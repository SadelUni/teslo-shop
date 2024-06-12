import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    limit?: number;


    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    offset?: number;
}