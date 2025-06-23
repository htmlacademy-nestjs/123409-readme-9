import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  @ApiProperty({
    description: 'User ID',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'User email',
  })
  @Expose()
  public email: string;

  @ApiProperty({
    description: 'Access token',
  })
  @Expose()
  public accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
  })
  @Expose()
  public refreshToken: string;
}