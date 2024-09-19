import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto, CreateQuizDto } from './create-quiz.dto';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateQuestionDto extends CreateQuestionDto {
  @IsNumber()
  @IsOptional()
  id?: number;
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  questions?: UpdateQuestionDto[];
}
