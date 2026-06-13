/**
 * Validation Module Index
 * 
 * Exporta todos os validadores do módulo de validação.
 */

export { CPFValidator } from './cpf.validator';
export { CNPJValidator } from './cnpj.validator';
export { EmailValidator } from './email.validator';
export { PhoneValidator } from './phone.validator';

export type {
  CPFValidationResult,
} from './cpf.validator';

export type {
  CNPJValidationResult,
} from './cnpj.validator';

export type {
  EmailValidationResult,
} from './email.validator';

export type {
  PhoneValidationResult,
} from './phone.validator';
