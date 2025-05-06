import { PartialType } from '@nestjs/mapped-types';
import { CreatePermessionDto } from './create-permession.dto';

export class UpdatePermessionDto extends PartialType(CreatePermessionDto) {}
