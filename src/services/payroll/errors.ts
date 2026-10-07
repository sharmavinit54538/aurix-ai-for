import axios, { isAxiosError, AxiosError } from "axios";

export class PayrollNotFoundError extends Error {
  response = { status: 404 };
  status = 404;
  constructor(message = "Payslip record not found for employee on backend.") {
    super(message);
    this.name = "PayrollNotFoundError";
  }
}

export function isAxiosErrorFn(err: unknown): err is AxiosError {
  return isAxiosError(err);
}

export function isNotFoundError(err: unknown): boolean {
  return isAxiosError(err) && err.response?.status === 404;
}