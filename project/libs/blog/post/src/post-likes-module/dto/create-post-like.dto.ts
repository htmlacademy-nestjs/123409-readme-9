import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreatePostLikeDto {
    @ApiProperty({
        description: 'Post ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsString()
    @IsNotEmpty()
    postId: string;
    
    @ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsString()
    @IsNotEmpty()
    userId: string;
} 