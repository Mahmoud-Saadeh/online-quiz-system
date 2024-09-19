import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Result } from './entities/result.entity';
import { Question } from 'src/quizzes/entities/question.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Result, Question, User])],
  providers: [QuizzesService, ResultService],
})
export class ResultModule {}
