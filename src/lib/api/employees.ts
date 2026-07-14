import {api} from "../../api/client";

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  profile_photo_url?: string;
  company_email: string;
  personal_email?: string;
  phone: string;
  department: string;
  designation: string;
  employment_type: string;
  shift: string;
  status: string;
  joining_date: string;
}

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get("/employees");

  return response.data.items;
};