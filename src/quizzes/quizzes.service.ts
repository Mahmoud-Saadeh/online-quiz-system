import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuestionDto, UpdateQuizDto } from './dto/update-quiz.dto';
import { Question } from './entities/question.entity';
import { Result } from 'src/result/entities/result.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    private readonly dataSource: DataSource,
  ) {}

  // Create a quiz with its questions
  create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    // Extract questions from the DTO
    const { questions } = createQuizDto;

    // Validate that each correctAnswer exists within the options
    if (questions) {
      questions.forEach((question) => {
        if (
          question.correctAnswer &&
          !question.options.includes(question.correctAnswer)
        ) {
          throw new BadRequestException(
            `Correct answer ${question.correctAnswer} is not among the options`,
          );
        }
      });
    }

    // Create and save the quiz
    const quiz = this.quizRepository.create(createQuizDto);
    return this.quizRepository.save(quiz);
  }

  // return all quizzes with their questions and answers
  findAll(): Promise<Quiz[]> {
    return this.quizRepository.find({ relations: ['questions'] });
  }

  // return a quiz by id with its questions but without answers
  async findOne(id: number, excludeCorrectAnswer = false): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questions'],
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz #${id} not found`);
    }

    if (excludeCorrectAnswer) {
      quiz.questions = quiz.questions.map((question) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        question.correctAnswer = '';
        return question;
      });
    }

    return quiz;
  }

  /*
    update a quiz
    update title and questions if present in the body
  */
  async update(id: number, updateQuizDto: UpdateQuizDto) {
    // Find the quiz with its questions
    const existingQuiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questions'],
    });

    if (!existingQuiz) {
      throw new NotFoundException(`Quiz #${id} not found`);
    }

    const questions =
      updateQuizDto.questions &&
      (await Promise.all(
        updateQuizDto.questions.map(async (question) => {
          if (
            typeof question.correctAnswer !== 'undefined' &&
            !question.options.includes(question.correctAnswer)
          ) {
            throw new BadRequestException(
              `Correct answer ${question.correctAnswer} is not among the options`,
            );
          }

          if (question.id) {
            const existingQuestion = existingQuiz.questions.find(
              (q) => q.id === question.id,
            );

            if (!existingQuestion) {
              throw new NotFoundException(
                `Question #${question.id} does not belong to Quiz #${id}`,
              );
            }

            // If the question exists in the quiz, preload the question by ID
            return await this.preloadQuestionById(question);
          }

          // If no question ID, treat it as a new question
          return this.questionRepository.create(question);
        }),
      ));

    // Preload the quiz with updated data and questions
    const updatedQuiz = await this.quizRepository.preload({
      id,
      ...updateQuizDto,
      questions,
    });

    if (!updatedQuiz) {
      throw new NotFoundException(`Quiz #${id} not found`);
    }

    // Handle deletion of questions no longer part of the quiz
    try {
      const existingQuestionIds = existingQuiz.questions.map((q) => q.id);
      const updatedQuestionIds = updateQuizDto.questions
        ? updateQuizDto.questions.filter((q) => q.id).map((q) => q.id)
        : [];

      const questionsToDelete = existingQuestionIds.filter(
        (id) => !updatedQuestionIds.includes(id),
      );

      if (questionsToDelete.length > 0) {
        await this.questionRepository.delete({ id: In(questionsToDelete) });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting removed questions',
      );
    }

    return this.quizRepository.save(updatedQuiz);
  }

  async delete(id: number): Promise<Quiz> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const quiz = await this.findOne(id);

      // Remove all questions associated with the quiz
      await this.questionRepository.delete({ quiz: { id: id } });

      // Remove all results associated with the quiz
      await this.resultRepository.delete({ quiz: { id: id } });

      return this.quizRepository.remove(quiz);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // release a queryRunner
      await queryRunner.release();
    }
  }

  private async preloadQuestionById(
    question: UpdateQuestionDto,
  ): Promise<Question> {
    if (question.id) {
      const existingQuestion = await this.questionRepository.save(question);

      if (existingQuestion) {
        return existingQuestion;
      }
    }

    return this.questionRepository.create(question);
  }
}
