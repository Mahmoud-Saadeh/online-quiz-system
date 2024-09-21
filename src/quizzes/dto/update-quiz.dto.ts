// import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto, CreateQuizDto } from './create-quiz.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateQuestionDto extends CreateQuestionDto {
  @IsNumber()
  @IsOptional()
  id?: number;
}

export class UpdateQuizDto extends CreateQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => UpdateQuestionDto)
  questions: UpdateQuestionDto[];
}
