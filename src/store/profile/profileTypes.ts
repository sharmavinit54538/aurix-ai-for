export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
  phone?: string;
}

export interface UpdateCurrentUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}
