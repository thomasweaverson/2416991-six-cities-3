import { AuthorizationStatus } from '../const/infrastructure';

export type AuthStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];
