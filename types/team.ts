// types/team.ts

/**
 * Represents a staff member's data
 */
export interface StaffMember {
  id?: string; // Add this

  team_id: string;
  name: string;
  job_title: string;
  bio: string;
  portrait: string;
  is_coach: boolean;
}

/**
 * Represents a team roster member's data
 */
export interface RosterMember {
  id?: string; // Add this

  team_id: string;
  name: string;
  position: string;
  height: number; // in centimeters
  weight: number; // in kilograms
  hometown: string;
  date_of_birth: string; // ISO 8601 format (YYYY-MM-DD)
  bio: string;
  portrait: string;
  is_active: boolean;
}

/**
 * Array types for multiple members
 */
export type StaffData = StaffMember[];
export type RosterData = RosterMember[];

/**
 * Combined team data type
 */
export interface CombinedTeamData {
  roster: RosterData;
  staff: StaffData;
}
