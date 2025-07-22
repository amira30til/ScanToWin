import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ApiResponseInterface,
  ErrorResponseInterface,
} from 'src/common/interfaces/response.interface';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create or update a player, register the game play, and e‑mail the reward',
    description:
      'Creates a new user if the e‑mail is new, or updates the existing user’s game history. ' +
      'Enforces a 24‑hour interval between plays and links the play to the active game assignment.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'User created successfully and reward e‑mail sent.',
    type: User,
  })
  @ApiOkResponse({
    description: 'Existing user updated and reward e‑mail sent.',
    type: User,
  })
  @ApiBadRequestResponse({
    description:
      'Validation error (e.g., play attempted within 24 h or no active game for shop).',
  })
  @ApiNotFoundResponse({
    description: 'Reward or other related entity not found.',
  })
  @ApiConflictResponse({
    description: 'Conflict (e.g., duplicate resource).',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error.',
  })
  async create(
    @Body() dto: CreateUserDto,
  ): Promise<ApiResponseInterface<User> | ErrorResponseInterface> {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @Get('by-date')
  @ApiOperation({ summary: 'Get users by creation date' })
  @ApiQuery({
    name: 'date',
    required: true,
    description:
      'Date in YYYY-MM-DD format to filter users by their creation date',
    example: '2025-07-22',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users created on the given date',
    type: [User],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request if date is missing or invalid',
  })
  async findUsersByDate(
    @Query('date') date: string,
  ): Promise<ApiResponseInterface<User[]> | ErrorResponseInterface> {
    return this.usersService.findUsersByDate(date);
  }
}
