import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectProfileState = (state: RootState) => state.profile;

export const selectCurrentUser = createSelector(
  [selectProfileState],
  (state) => state?.currentUser ?? null,
);

export const selectUserSessions = createSelector(
  [selectProfileState],
  (state) => state?.sessions ?? [],
);

export const selectUserPreferences = createSelector(
  [selectProfileState],
  (state) => state?.preferences ?? null,
);

export const selectProfileLoading = createSelector(
  [selectProfileState],
  (state) => state?.loading ?? false,
);

export const selectProfileSubmitting = createSelector(
  [selectProfileState],
  (state) => state?.submitting ?? false,
);

export const selectProfileError = createSelector(
  [selectProfileState],
  (state) => state?.error ?? null,
);

export const selectProfileErrors = createSelector(
  [selectProfileState],
  (state) => state?.operationErrors ?? {},
);

export const selectProfileOperationLoading = createSelector(
  [selectProfileState],
  (state) => state?.operationLoading ?? {},
);

export const selectProfileOperationSuccess = createSelector(
  [selectProfileState],
  (state) => state?.operationSuccess ?? {},
);
