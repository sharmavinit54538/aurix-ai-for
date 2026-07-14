import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/lib/api/employees";

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
};