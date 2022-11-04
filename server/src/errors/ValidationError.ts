import { BusinessError } from './BusinessError';

export class ValidationError extends BusinessError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
