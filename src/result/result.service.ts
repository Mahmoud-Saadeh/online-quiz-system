import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Repository } from 'typeorm';
import { CreateResultDto } from './dto/create-result.dto';
// import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { AttemptQuizDto } from 'src/quizzes/dto/attempt-quiz.dto';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private quizService: QuizzesService,
  ) {}

  async createResult(createResultDto: CreateResultDto) {
    const result = this.resultRepository.create(createResultDto);
    return this.resultRepository.save(result);
  }

  async getUserResults(userId: number) {
    return this.resultRepository.find({
      where: {
        user: { id: userId },
      },
    });
  }

  async calculateScore(
    quizId: number,
    answers: AttemptQuizDto,
  ): Promise<number> {
    const quiz = await this.quizService.findOne(quizId);
    let score = 0;

    quiz.questions.forEach((question) => {
      const questionAns = answers.givenAnswers.find(
        (answer) => answer.questionId === question.id,
      );
      if (questionAns && question.correctAnswer === questionAns.givenAnswer) {
        score++;
      }
    });

    return score;
  }

  async saveResult(
    userId: number,
    quizId: number,
    score: number,
    answers: AttemptQuizDto,
  ): Promise<Result> {
    // Fetch the User entity by user id
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    // Fetch the full Quiz entity with its questions
    const quiz = await this.quizService.findOne(quizId);

    if (!quiz || !quiz.questions) {
      throw new Error('Quiz or questions not found');
    }

    // Create a new Result entity
    const result = this.resultRepository.create({
      user,
      quiz,
      score,
      answers: answers.givenAnswers,
    });

    // Save the Result entity to the database
    return this.resultRepository.save(result);
  }
}
