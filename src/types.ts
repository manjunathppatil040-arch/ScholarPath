export type EducationStage =
  | 'Class 9'
  | 'Class 10'
  | 'Class 11–12'
  | 'Class 12 passed'
  | 'Diploma/ITI'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'Other';

export type CourseField =
  | 'Engineering & Technology'
  | 'Medical, Nursing & Allied Health'
  | 'Pure Sciences (B.Sc / M.Sc)'
  | 'Commerce, Management & CA'
  | 'Arts, Humanities & Social Sciences'
  | 'Law (LL.B / Integrated Law)'
  | 'Vocational & ITI Trades'
  | 'General / Any Stream';

export type IndianState =
  | 'All India / Pan-India'
  | 'Karnataka'
  | 'Maharashtra'
  | 'Delhi NCR'
  | 'Tamil Nadu'
  | 'Uttar Pradesh'
  | 'Kerala'
  | 'West Bengal'
  | 'Telangana'
  | 'Andhra Pradesh'
  | 'Gujarat'
  | 'Rajasthan'
  | 'Bihar'
  | 'Madhya Pradesh'
  | 'Punjab & Haryana'
  | 'Odisha'
  | 'North Eastern States'
  | 'Other State / UT';

export type AnnualIncome =
  | 'Below ₹1,50,000'
  | '₹1,50,000 - ₹2,50,000'
  | '₹2,50,000 - ₹4,00,000'
  | '₹4,00,000 - ₹6,00,000'
  | '₹6,00,000 - ₹8,00,000'
  | 'Above ₹8,00,000'
  | 'Prefer not to say';

export type StudyYear =
  | '1st Year (Fresher)'
  | '2nd Year'
  | '3rd Year'
  | '4th Year / Final Year'
  | 'Not Applicable / School';

export type GenderPreference =
  | 'All Genders'
  | 'Female / Girl Student'
  | 'Male'
  | 'Other / Non-Binary';

export interface StudentProfile {
  fullName: string;
  educationStage: EducationStage | '';
  courseField: CourseField | '';
  state: IndianState | '';
  studyYear: StudyYear | '';
  incomeRange: AnnualIncome | '';
  gender: GenderPreference | '';
  previousScorePercentage: number | ''; // e.g. 78% in 10th or 12th
  socialCategory?: 'SC' | 'OBC' | 'EBC' | 'DNT' | 'Other / not listed' | '';
  /** Explicitly marked fictional values used only when a visitor chooses the guided demo. */
  isDemoProfile?: boolean;
}

export type MatchCategory = 'likely' | 'possible' | 'mismatch';

export interface MatchResult {
  category: MatchCategory;
  headline: string;
  reasons: string[];
  missingOrUnknown: string[];
  mismatchReasons: string[];
  guidanceNotice: string;
}

export type ApplicationStage =
  | 'none'
  | 'interested'
  | 'preparing'
  | 'started'
  | 'submitted'
  | 'awaiting_result';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  providerType: 'Government (Central/State)' | 'Corporate CSR' | 'Trust / Foundation' | 'Educational Institution';
  summary: string;
  awardAmountRupees: number;
  awardDisplay: string;
  awardFrequency: 'Per Annum' | 'One-Time Grant' | 'Per Month' | 'Entire Course Duration';
  awardType: 'Merit-based' | 'Need-cum-Merit' | 'Girls in STEM' | 'Crisis Support' | 'Vocational / ITI';
  deadline: string; // ISO format "2026-10-31"
  deadlineDisplay: string; // "31 October 2026"
  applicationStatus: 'Applications Open' | 'Upcoming' | 'Closed' | 'Unknown';
  educationStages: EducationStage[];
  courseFields: CourseField[];
  states: IndianState[];
  minPercentage?: number;
  maxAnnualIncomeRupees?: number;
  incomeLimitType?: 'less-than' | 'less-than-or-equal';
  genderRestriction?: 'all' | 'female_only';
  studyYearRestriction?: StudyYear[];
  keyEligibilityList: string[];
  confirmedDocuments: string[];
  applicationSteps: string[];
  preparationChecklist: string[];
  infoSourceUrl: string;
  infoSourceLabel: string;
  statusSourceUrl?: string;
  statusSourceLabel?: string;
  applicationUrl?: string;
  applicationPlatformName: string;
  applicationUrlVerified: boolean;
  lastCheckedDate: string;
  sourceVerificationNote: string;
  isDemoRecord: boolean;
  tags: string[];
}

export interface ScholarshipUserData {
  status: ApplicationStage;
  isSaved: boolean;
  completedChecklist: string[];
  customTasks?: string[];
  notes: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  educationStage: string;
  courseField: string;
  state: string;
  awardType: string;
  minAmountRupees: number;
  deadlineFilter: 'all' | '30days' | '60days' | '90days' | 'open_only';
  onlyLikelyMatches: boolean;
  sortBy: 'best-match' | 'soonest-deadline' | 'award-high' | 'name';
}
