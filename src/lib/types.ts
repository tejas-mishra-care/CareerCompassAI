export interface Skill {
  name: string;
  proficiency: number; // 0-100
}

export interface UserProfile {
  name: string;
  bio: string;
  skills: Skill[];
}
