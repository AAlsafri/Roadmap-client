export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface DeveloperProfile {
  user: UserProfile;
  is_developer: boolean;
  job_title: string;
  years_of_experience: number;
  skills: string[];
  available_date: string | null;
}
