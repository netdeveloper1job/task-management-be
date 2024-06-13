import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "src/common/Enums/task.enum";

export class CreateTaskDto {

    @IsNotEmpty({ message: 'User should not be empty' })
    @ApiProperty()
    userId: number;

    @IsNotEmpty({ message: 'Title should not be empty' })
    @ApiProperty()
    title: string;

    @IsNotEmpty({ message: 'Description should not be empty' })
    @ApiProperty()
    description: string;

    @ApiProperty({ default: TaskStatus.TODO })
    @IsEnum(TaskStatus)
    status: TaskStatus;
}