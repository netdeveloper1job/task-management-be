import { TaskStatus } from 'src/common/Enums/task.enum';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: TaskStatus.TODO })
  status: TaskStatus;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    nullable: true,
    default: () => 'null',
  })
  updatedAt: Date;
  
  @ManyToOne(
    () => User,
    (user: User) =>
        user.task,
    {
      eager: false,
      onDelete: 'CASCADE',
    },
  )
  user: User[];
}
