import { BusinessError } from './BusinessError';

export class AuthenticationError extends BusinessError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
