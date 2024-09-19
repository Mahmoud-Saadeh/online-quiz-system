import { IsNumber, IsArray } from 'class-validator';

export class CreateResultDto {
  @IsNumber()
  quizId: number;

  @IsNumber()
  userId: number;
  //   @IsString()
  //   username: string;

  @IsNumber()
  score: number;

  @IsArray()
  answers: {
    questionId: number;
    givenAnswer: string;
  }[];
}
