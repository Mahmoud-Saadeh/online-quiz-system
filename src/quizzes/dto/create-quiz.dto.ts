import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsString()
  questionText: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsString()
  correctAnswer: string;
}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
