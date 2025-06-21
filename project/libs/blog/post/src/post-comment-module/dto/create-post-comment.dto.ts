import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { POST_COMMENT_MESSAGE_EMPTY } from "../post-comment.constants";
export class CreatePostCommentDto {
    @ApiProperty({
        description: 'Comment content',
        example: 'This is a comment'
    })
    @IsString()
    @IsNotEmpty({message: POST_COMMENT_MESSAGE_EMPTY})   
    @MinLength(10)
    @MaxLength(300)
    content: string;

    @ApiProperty({
        description: 'Post ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    postId: string;
    
    @ApiProperty({
        description: 'Author ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    authorId: string;
} 