declare module "jsonwebtoken" {
  export type JwtPayload = Record<string, any>;
  export function sign(payload: string | Buffer | object, secretOrPrivateKey: string, options?: any): string;
  export const jwtSign: typeof sign;
  export function verify(token: string, secretOrPublicKey: string, options?: any): string | JwtPayload;
  export const jwtVerify: typeof verify;
  export function decode(token: string, options?: any): string | JwtPayload | null;
}
