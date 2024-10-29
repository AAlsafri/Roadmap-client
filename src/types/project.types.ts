import { UserProfile } from "./user.types";
export interface Project {
  id: number;
  name: string;
  description: string;
  owner: UserProfile;
  assigned_users: UserProfile[];
  created_at: string;
  updated_at: string;
}
