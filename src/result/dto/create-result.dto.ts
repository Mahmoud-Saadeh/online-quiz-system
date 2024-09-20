import { IsNumber, IsArray } from 'class-validator';

export class CreateResultDto {
  @IsNumber()
  quizId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  score: number;

  @IsArray()
  answers: {
    questionId: number;
    givenAnswer: string;
  }[];
}
