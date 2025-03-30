import { IsString } from "class-validator";

export class CreateMemoryDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    image_url: string;
    
    @IsString()
    user_id: string;
}
