import { ApplicationError } from '@/protocols';

export function notPaidError(): ApplicationError {
  return {
    name: 'NotPaidError',
    message: 'Payment not found or ticket does not cover hotel!',
  };
}
