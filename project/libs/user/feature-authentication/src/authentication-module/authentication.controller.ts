import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/helpers';
import { LoggedUserRdo } from '../rdo/logged-user.rdo';
import { NotifyService } from '@project/user-notify';


@ApiTags('auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly notifyService: NotifyService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserDto
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'User with this email already exists.' })
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.register(dto);

    const { email, firstName, lastName } = newUser;
    await this.notifyService.registerSubscriber({ email, firstName, lastName });

    const userToken = await this.authService.createUserToken(newUser);
    return fillDto(LoggedUserRdo, { ...newUser.toPOJO(), ...userToken });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: LoginUserDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async login(@Body() dto: LoginUserDto) {
    const verifiedUser = await this.authService.verifyUser(dto);
    const userToken = await this.authService.createUserToken(verifiedUser);
    return fillDto(LoggedUserRdo, { ...verifiedUser.toPOJO(), ...userToken });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found.',
    type: CreateUserDto
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  public async show(@Param('id', MongoIdValidationPipe) id: string) {
    const existUser = await this.authService.getUser(id);
    return existUser.toPOJO();
  }
}
