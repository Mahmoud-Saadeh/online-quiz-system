import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { AttemptQuizDto } from './dto/attempt-quiz.dto';
import { ResultService } from 'src/result/result.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { REQUEST_USER_KEY, ROLES } from 'src/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('quiz')
export class QuizzesController {
  constructor(
    private readonly quizService: QuizzesService,
    private readonly resultService: ResultService,
  ) {}

  @ApiTags('Admin')
  @UseGuards(RolesGuard)
  @Roles(ROLES.ADMIN)
  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @ApiTags('Admin')
  @UseGuards(RolesGuard)
  @Roles(ROLES.ADMIN)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateQuizDto: UpdateQuizDto,
  ) {
    return this.quizService.update(id, updateQuizDto);
  }

  @ApiTags('Admin')
  @UseGuards(RolesGuard)
  @Roles(ROLES.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.quizService.delete(id);
  }

  @ApiTags('User')
  @Get(':id')
  getQuiz(@Param('id') id: number) {
    return this.quizService.findOne(id, true);
  }

  @ApiTags('User')
  @Post(':id/attempt')
  async attemptQuiz(
    @Param('id') quizId: number,
    @Body() answers: AttemptQuizDto,
    @Req() req: any,
  ) {
    const user = req[REQUEST_USER_KEY];

    const userId: number = user.userId;
    const score = await this.resultService.calculateScore(quizId, answers);

    const result = await this.resultService.saveResult(
      userId,
      quizId,
      score,
      answers,
    );

    const scorePercentage = (result.score / result.quiz.questions.length) * 100;
    return { quiz: result.quiz, score: `${scorePercentage}%` };
  }
}
