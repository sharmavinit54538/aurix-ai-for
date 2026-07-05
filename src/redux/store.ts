import { configureStore } from "@reduxjs/toolkit";
import departmentsReducer from "@/features/departments/departmentsSlice";
import employeesReducer from "@/features/employees/employeesSlice";
import managersReducer from "@/features/managers/managersSlice";
import performanceReducer from "@/features/performance/performanceSlice";

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    departments: departmentsReducer,
    managers: managersReducer,
    performance: performanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
