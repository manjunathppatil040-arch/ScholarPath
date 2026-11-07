import { StudentProfile, ScholarshipUserData } from '../types';

const PROFILE_KEY = 'scholarpath_india_student_profile_v2';
// New key intentionally avoids importing legacy demo notes and checklist progress.
const USER_DATA_KEY = 'scholarpath_india_user_data_v2';

export const EMPTY_PROFILE: StudentProfile = {
  fullName: '',
  educationStage: '',
  courseField: '',
  state: '',
  studyYear: '',
  incomeRange: '',
  gender: '',
  previousScorePercentage: '',
  socialCategory: ''
};

export function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return EMPTY_PROFILE;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading profile from localStorage:', e);
    return EMPTY_PROFILE;
  }
}

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile to localStorage:', e);
  }
}

export function loadUserScholarshipData(): Record<string, ScholarshipUserData> {
  try {
    const raw = localStorage.getItem(USER_DATA_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading user scholarship data:', e);
    return {};
  }
}

export function saveUserScholarshipData(data: Record<string, ScholarshipUserData>): void {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving user scholarship data:', e);
  }
}

export function getOrCreateItemData(
  allData: Record<string, ScholarshipUserData>,
  scholarshipId: string
): ScholarshipUserData {
  return (
    allData[scholarshipId] || {
      status: 'none',
      isSaved: false,
      completedChecklist: [],
      customTasks: [],
      notes: '',
      updatedAt: new Date().toISOString()
    }
  );
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem('scholarpath_india_student_profile');
    localStorage.removeItem('scholarpath_india_user_data');
  } catch (e) {
    console.error('Error clearing localStorage data:', e);
  }
}
