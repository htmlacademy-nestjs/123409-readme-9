import { IsEmail, IsNotEmpty } from 'class-validator';

import {
  emailErrors,
} from '../email-subscriber.constant';

export class CreateSubscriberDto {
  @IsEmail({}, { message: emailErrors.EMAIL_NOT_VALID })
  public email: string;

  @IsNotEmpty({ message: emailErrors.FIRST_NAME_IS_EMPTY })
  public firstname: string;

  @IsNotEmpty({ message: emailErrors.USER_ID_IS_EMPTY })
  public lastname: string;
}