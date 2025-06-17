import { SetMetadata } from '@nestjs/common';
import { RoleUser } from '../models/roles.model';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RoleUser[]) => SetMetadata('roles', roles);
