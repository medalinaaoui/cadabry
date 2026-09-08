export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "INVALID_INPUT"
  | "SETUP_ALREADY_COMPLETED"
  | "SESSION_INVALID";

export class AuthError extends Error {
  constructor(public readonly code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
  }
}
