import { configureStore } from "@reduxjs/toolkit";
import departmentsReducer from "@/features/admin/departments/departmentsSlice";
import employeesReducer from "@/features/admin/employees/employeesSlice";
import managersReducer from "@/features/admin/managers/managersSlice";
import performanceReducer from "@/features/admin/performance/performanceSlice";
import recruitmentReducer from "@/features/admin/recruitment/recruitmentSlice";

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    departments: departmentsReducer,
    managers: managersReducer,
    performance: performanceReducer,
    recruitment: recruitmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
