import { SetMetadata } from '@nestjs/common';
import { Role } from '@workspace/data';

export const RequireRole = (role: Role) => SetMetadata('role', role);
