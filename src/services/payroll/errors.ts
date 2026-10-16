import axios, { isAxiosError, AxiosError } from "axios";

export class PayrollNotFoundError extends Error {
  response = { status: 404 };
  status = 404;
  constructor(message = "Payslip record not found for employee on backend.") {
    super(message);
    this.name = "PayrollNotFoundError";
  }
}

export class PayrollConflictError extends Error {
  response = { status: 409 };
  status = 409;
  constructor(message = "Conflict: resource already exists or operation cannot be completed.") {
    super(message);
    this.name = "PayrollConflictError";
  }
}

export function isAxiosErrorFn(err: unknown): err is AxiosError {
  return isAxiosError(err);
}

export function isNotFoundError(err: unknown): boolean {
  return isAxiosError(err) && err.response?.status === 404;
}

export function isConflictError(err: unknown): boolean {
  return isAxiosError(err) && err.response?.status === 409;
}