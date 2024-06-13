import { LoggedInType } from 'src/common/Enums/registration.enum';
import { Task } from 'src/tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  contactNo: string;

  @Column()
  profileImage: string;

  @Column({ default: LoggedInType.USER })
  loggedInType: LoggedInType;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    nullable: true,
    default: () => 'null',
  })
  updatedAt: Date;

  @OneToMany(() => Task, (task: Task) => task.user, {
    cascade: true,
  })
  task: Task;
}
