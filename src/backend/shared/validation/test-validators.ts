/**
 * Test Script para Validadores
 * 
 * Script simples para testar os validadores manualmente.
 */

import { CPFValidator } from './cpf.validator.ts';
import { CNPJValidator } from './cnpj.validator.ts';
import { EmailValidator } from './email.validator.ts';
import { PhoneValidator } from './phone.validator.ts';

console.log('=== Testando Validadores ===\n');

// Testar CPFValidator
console.log('1. CPFValidator:');
const cpfTests = [
  '529.982.247-25', // válido
  '111.111.111-11', // inválido (todos iguais)
  '123.456.789',     // inválido (tamanho incorreto)
];

cpfTests.forEach(cpf => {
  const result = CPFValidator.validate(cpf);
  console.log(`  CPF: ${cpf}`);
  console.log(`  Válido: ${result.isValid}`);
  if (!result.isValid) {
    console.log(`  Erros: ${result.errors.join(', ')}`);
  }
  console.log();
});

// Testar CNPJValidator
console.log('2. CNPJValidator:');
const cnpjTests = [
  '11.444.777/0001-61', // válido
  '11.111.111/1111-11', // inválido (todos iguais)
  '12.345.678',          // inválido (tamanho incorreto)
];

cnpjTests.forEach(cnpj => {
  const result = CNPJValidator.validate(cnpj);
  console.log(`  CNPJ: ${cnpj}`);
  console.log(`  Válido: ${result.isValid}`);
  if (!result.isValid) {
    console.log(`  Erros: ${result.errors.join(', ')}`);
  }
  console.log();
});

// Testar EmailValidator
console.log('3. EmailValidator:');
const emailTests = [
  'user@example.com',    // válido
  'invalid-email',       // inválido
  '',                     // inválido (vazio)
];

emailTests.forEach(email => {
  const result = EmailValidator.validate(email);
  console.log(`  Email: ${email}`);
  console.log(`  Válido: ${result.isValid}`);
  if (!result.isValid) {
    console.log(`  Erros: ${result.errors.join(', ')}`);
  }
  console.log();
});

// Testar PhoneValidator
console.log('4. PhoneValidator:');
const phoneTests = [
  '(11) 98765-4321',     // válido (móvel)
  '(11) 3456-7890',      // válido (fixo)
  '(99) 12345-6789',     // inválido (DDD inválido)
  '123',                 // inválido (tamanho incorreto)
];

phoneTests.forEach(phone => {
  const result = PhoneValidator.validate(phone);
  console.log(`  Telefone: ${phone}`);
  console.log(`  Válido: ${result.isValid}`);
  if (!result.isValid) {
    console.log(`  Erros: ${result.errors.join(', ')}`);
  }
  console.log();
});

console.log('=== Testes Concluídos ===');
