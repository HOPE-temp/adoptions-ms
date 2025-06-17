import { RoleUser } from './roles.model';

export interface PayloadToken {
  role: RoleUser;
  sub: number;
}
