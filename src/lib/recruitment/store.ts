/**
 * @deprecated Import from `@/features/admin/recruitment/hooks/useRecruitment` instead.
 * Shim for legacy route files during migration.
 */
import { createRecruitmentApi } from "@/features/admin/recruitment/hooks/useRecruitment";
import { fetchRecruitmentData } from "@/features/admin/recruitment/recruitmentThunk";
import type { AppDispatch } from "@/redux/store";
import { store } from "@/redux/store";

export {
  useRecruitment,
  newId,
  createRecruitmentApi,
} from "@/features/admin/recruitment/hooks/useRecruitment";

export { fetchRecruitmentData };

/** @deprecated Use `useRecruitment().refreshAll()` inside a React component. */
export function refreshAll() {
  return store.dispatch(fetchRecruitmentData());
}

/** @deprecated Use `useRecruitment()` or `createRecruitmentApi(dispatch)` in components. */
export const recruitment = createRecruitmentApi(store.dispatch as AppDispatch);
