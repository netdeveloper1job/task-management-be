import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../../../common/Enums/task.enum";

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

    @IsNotEmpty({ message: 'Description should not be empty' })
    @ApiProperty()
    dueDate: string;

    @ApiProperty({ default: TaskStatus.TODO })
    @IsEnum(TaskStatus)
    status: TaskStatus;
}
