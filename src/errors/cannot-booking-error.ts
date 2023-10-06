import { ApplicationError } from '@/protocols';

export function cannotBookingError(msg = 'Cannot booking!'): ApplicationError {
  return {
    name: 'CannotBookingError',
    message: msg,
  };
}
