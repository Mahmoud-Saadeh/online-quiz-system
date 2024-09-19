import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { ResultService } from 'src/result/result.service';
import { Result } from 'src/result/entities/result.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question, Result, User])],
  controllers: [QuizzesController],
  providers: [QuizzesService, ResultService],
})
export class QuizzesModule {}
