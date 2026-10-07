import axios from "axios";

export class PayrollNotFoundError extends Error {
  response = { status: 404 };
  status = 404;
  constructor(message = "Payslip record not found for employee on backend.") {
    super(message);
    this.name = "PayrollNotFoundError";
  }
}

export function isAxiosError(err: unknown): err is axios.AxiosError {
  return axios.isAxiosError(err);
}

export function isNotFoundError(err: unknown): boolean {
  return axios.isAxiosError(err) && err.response?.status === 404;
}