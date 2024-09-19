import { IsArray, ValidateNested, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class Answer {
  @IsNumber()
  questionId: number;

  @IsString()
  givenAnswer: string;
}

export class AttemptQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  givenAnswers: Answer[];
}
