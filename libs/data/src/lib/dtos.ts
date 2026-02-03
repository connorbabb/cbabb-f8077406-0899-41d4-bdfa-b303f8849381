export class LoginDto {
  email!: string;
  password!: string;
}

export class CreateTaskDto {
  title!: string;
  description!: string;
  category!: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  category?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}
