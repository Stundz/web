import type { Plug } from 'shared/models';

export type PastQuestionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type TutorDecision = 'approve' | 'reject' | 'pending';
export type TutorStanding = 'pending' | 'approved' | 'inactive';

export interface PlugPublisher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PlugPastQuestion {
  id: string;
  created_at: string;
  updated_at: string;
  status: PastQuestionStatus;
  year: number;
  solutions_count?: number;
  course_id: string;
  publisher_id: string | null;
  publisher?: PlugPublisher | null;
  course?: Plug.Course | null;
}

export interface PlugTutorRecord {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  endorsement: { email: string | null; name: string | null } | null;
  valid_until: string | null;
  courses?: Plug.Course[];
  user?: Plug.User | null;
}

export interface PlugTutorialRecord {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  price: number | string;
  course_id: string;
  tutor_id: string;
  course?: Plug.Course | null;
  tutor?: Plug.Tutor | null;
  session?: Plug.Session | null;
  sessions?: Plug.Session[];
}

export const paperStatuses = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
] as const;

export const tutorFilters = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'inactive', label: 'Inactive' },
] as const;

export function paperStatusLabel(status: string): string {
  return paperStatuses.find((item) => item.value === status)?.label ?? status;
}

export function personName(person?: { first_name?: string; last_name?: string } | null): string {
  const name = `${person?.first_name ?? ''} ${person?.last_name ?? ''}`.trim();
  return name || 'Unknown';
}

export function paperPlace(course?: Plug.Course | null): string {
  const institution = course?.department?.faculty?.institution;
  const department = course?.department?.name;
  if (institution && department) {
    return `${institution.acronym || institution.name} · ${department}`;
  }
  return institution?.name || department || 'Academic place unavailable';
}

export function tutorStanding(validUntil: string | null | undefined): TutorStanding {
  if (!validUntil) return 'pending';
  const time = new Date(validUntil).getTime();
  if (Number.isNaN(time) || time <= Date.now()) return 'inactive';
  return 'approved';
}

export function standingLabel(standing: TutorStanding): string {
  if (standing === 'approved') return 'Approved';
  if (standing === 'inactive') return 'Inactive';
  return 'Pending';
}
