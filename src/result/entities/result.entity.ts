import { User } from 'src/auth/user.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.results)
  quiz: Quiz;

  @ManyToOne(() => User, (user) => user.results)
  user: User;

  @Column()
  score: number;

  @Column('json')
  answers: { questionId: number; givenAnswer: string }[];
}
