// Re-export the new modular ShiftsPage for backward compatibility
export { ShiftsPage } from "../shifts/ShiftsPage";
export { ShiftCard } from "../shifts/components/ShiftCard";
export { ShiftFormDialog } from "../shifts/components/ShiftFormDialog";
export { AssignShiftDialog } from "../shifts/components/AssignShiftDialog";
export { DeleteShiftDialog } from "../shifts/components/DeleteShiftDialog";
export { ShiftStats } from "../shifts/components/ShiftStats";
export { ShiftFilters } from "../shifts/components/ShiftFilters";
export { ChangeRequestsPanel } from "../shifts/components/ChangeRequestsPanel";
export { shiftFormSchema, type ShiftFormData } from "../shifts/schemas/shiftFormSchema";
export { useShiftsQuery, useShiftOptionsQuery, useCreateShift, useUpdateShift, useDeleteShift, useAssignShift, useShiftEmployeesQuery, useMyScheduleQuery, useMyChangeRequestsQuery, useCreateChangeRequest, useChangeRequestsAdminQuery, useReviewChangeRequest } from "../shifts/hooks/useShifts";
export { default } from "../shifts/ShiftsPage";