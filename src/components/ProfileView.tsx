import React, { useEffect, useState } from 'react';
import {
  StudentProfile,
  EducationStage,
  CourseField,
  IndianState,
  AnnualIncome,
  StudyYear
} from '../types';
import { User, GraduationCap, BookOpen, MapPin, IndianRupee, CheckCircle2, ShieldCheck, Sparkles, Trash2, Calendar } from 'lucide-react';

interface ProfileViewProps {
  profile: StudentProfile;
  onSaveProfile: (updatedProfile: StudentProfile) => void;
  onClearAllData: () => void;
  onNavigateToDiscovery: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onClearAllData,
  onNavigateToDiscovery,
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  useEffect(() => setFormData({ ...profile }), [profile]);

  // Profile readiness score
  const completenessItems = [Boolean(formData.educationStage), Boolean(formData.state)];
  const completedFields = completenessItems.filter(Boolean).length;
  const completenessPercent = Math.round((completedFields / completenessItems.length) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearMyData = () => {
    onClearAllData();
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 animate-fade-in space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Honest Indian Student Profile</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Your Student Profile
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
          ScholarPath uses these details strictly to guide your match status (Likely match, Possible match, or Confirmed mismatch). All fields are optional.
        </p>
      </div>

      {/* Browser Storage Guarantee Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-800">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm text-stone-700">
            <strong className="font-semibold text-emerald-950 block">
            Browser-only profile &bull; Stored only on this device
          </strong>
          <p className="leading-relaxed">
            Create or edit your profile here, or clear it any time. We never ask for Aadhaar, bank details, passwords, phone numbers, or document uploads. Your profile and personal tracking progress stay in this browser only.
          </p>
        </div>
      </div>

      {/* Profile Readiness Meter */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-stone-700">Profile Readiness for Match Guidance:</span>
          <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {completenessPercent}% complete ({completedFields} of {completenessItems.length} fields)
          </span>
        </div>
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-700 h-full transition-all duration-300"
            style={{ width: `${completenessPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-stone-500">
          Match guidance checks only criteria documented for each listed opportunity. Anything unknown stays “Needs checking.”
        </p>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Full Name */}
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-800" />
                <span>Student Name or Nickname (Optional)</span>
              </label>
              <span className="text-[11px] text-stone-400">Used for friendly dashboard greeting</span>
            </div>
            <input
              id="fullName"
              type="text"
              placeholder="e.g. Student or a nickname"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
            />
          </div>

          {/* Education Stage */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="educationStage" className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-800" />
                <span>Education Stage</span>
              </label>
            </div>
            <p className="text-[11px] text-stone-500">Helps filter schemes targeting your specific grade level</p>
            <select
              id="educationStage"
              value={formData.educationStage}
              onChange={(e) => setFormData({ ...formData, educationStage: e.target.value as EducationStage })}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              <option value="">Select current stage...</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11–12">Class 11–12</option>
              <option value="Class 12 passed">Class 12 passed (Awaiting UG)</option>
              <option value="Diploma/ITI">Diploma / Polytechnic / ITI</option>
              <option value="Undergraduate">Undergraduate (B.Tech, B.Sc, B.Com, MBBS, etc.)</option>
              <option value="Postgraduate">Postgraduate (M.Tech, M.Sc, M.Com, MBA, etc.)</option>
              <option value="Other">Other Higher Education</option>
            </select>
          </div>

          {/* Course / Academic Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="courseField" className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
                <span>Course Stream / Field</span>
              </label>
            </div>
            <p className="text-[11px] text-stone-500">Separates technical, medical, commerce, and arts opportunities</p>
            <select
              id="courseField"
              value={formData.courseField}
              onChange={(e) => setFormData({ ...formData, courseField: e.target.value as CourseField })}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              <option value="">Select course stream...</option>
              <option value="Engineering & Technology">Engineering & Technology</option>
              <option value="Medical, Nursing & Allied Health">Medical, Nursing & Allied Health</option>
              <option value="Pure Sciences (B.Sc / M.Sc)">Pure Sciences (B.Sc / M.Sc)</option>
              <option value="Commerce, Management & CA">Commerce, Management & CA</option>
              <option value="Arts, Humanities & Social Sciences">Arts, Humanities & Social Sciences</option>
              <option value="Law (LL.B / Integrated Law)">Law (LL.B / Integrated Law)</option>
              <option value="Vocational & ITI Trades">Vocational & ITI Trades</option>
              <option value="General / Any Stream">General / Open to Any Stream</option>
            </select>
          </div>

          {/* Indian State / Region */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="state" className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                <span>State or Domicile Region</span>
              </label>
            </div>
            <p className="text-[11px] text-stone-500">Checks domicile state vs Pan-India eligibility</p>
            <select
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value as IndianState })}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              <option value="">Select state or domicile...</option>
              <option value="All India / Pan-India">All India / Pan-India (National)</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Kerala">Kerala</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Bihar">Bihar</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Punjab & Haryana">Punjab & Haryana</option>
              <option value="Odisha">Odisha</option>
              <option value="North Eastern States">North Eastern States (Assam, Meghalaya, etc.)</option>
              <option value="Other State / UT">Other State / Union Territory</option>
            </select>
          </div>

          {/* Current Year of Study */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="studyYear" className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                <span>Current Year of Study</span>
              </label>
            </div>
            <p className="text-[11px] text-stone-500">Used only when a listed scheme confirms a year-of-study rule.</p>
            <select
              id="studyYear"
              value={formData.studyYear}
              onChange={(e) => setFormData({ ...formData, studyYear: e.target.value as StudyYear })}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              <option value="">Select study year...</option>
              <option value="1st Year (Fresher)">1st Year (Fresher / Newly Admitted)</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year / Final Year">4th Year / Final Year</option>
              <option value="Not Applicable / School">Not Applicable / School Student</option>
            </select>
          </div>

          {/* Annual Family Income Range */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="incomeRange" className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-800" />
                <span>Annual Family Income Range (Optional)</span>
              </label>
            </div>
            <p className="text-[11px] text-stone-500">Optional. Some schemes have income limits; this stays in this browser and can be cleared.</p>
            <select
              id="incomeRange"
              value={formData.incomeRange}
              onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value as AnnualIncome })}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              <option value="">Prefer not to say</option>
              <option value="Below ₹1,50,000">Below ₹1,50,000</option>
              <option value="₹1,50,000 - ₹2,50,000">₹1,50,000 - ₹2,50,000</option>
              <option value="₹2,50,000 - ₹4,00,000">₹2,50,000 - ₹4,00,000</option>
              <option value="₹4,00,000 - ₹6,00,000">₹4,00,000 - ₹6,00,000</option>
              <option value="₹6,00,000 - ₹8,00,000">₹6,00,000 - ₹8,00,000</option>
              <option value="Above ₹8,00,000">Above ₹8,00,000</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Optional community category */}
          <div className="space-y-1.5">
            <label htmlFor="socialCategory" className="text-xs font-bold uppercase tracking-wider text-stone-600">Community category (optional)</label>
            <p className="text-[11px] text-stone-500">Sensitive and optional. Used only to check schemes whose listed criteria specify a category.</p>
            <select
              id="socialCategory"
              value={formData.socialCategory || ''}
              onChange={(e) => setFormData({ ...formData, socialCategory: e.target.value as StudentProfile['socialCategory'] })}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              <option value="">Prefer not to say</option>
              <option value="SC">SC</option>
              <option value="OBC">OBC</option>
              <option value="EBC">EBC</option>
              <option value="DNT">DNT</option>
              <option value="Other / not listed">Other / not listed</option>
            </select>
          </div>

        </div>

        {/* Buttons and Actions */}
        <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-800 text-white rounded-xl text-sm font-semibold hover:bg-emerald-900 transition-colors shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-3 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 border border-rose-200"
            >
              <Trash2 className="w-4 h-4 text-rose-700" />
              <span>Clear My Data</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1.5 rounded-lg border border-emerald-300 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Profile updated! Match status recalculated across opportunities.</span>
            </div>
          )}

          <button
            type="button"
            onClick={onNavigateToDiscovery}
            className="text-xs font-semibold text-emerald-900 hover:text-emerald-700 underline underline-offset-4 flex items-center gap-1 ml-auto"
          >
            <span>View matched scholarships &rarr;</span>
          </button>
        </div>
      </form>

      {/* Clear Data Modal Confirmation */}
      {showClearConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Clear all browser-stored data?
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                This will reset your profile, saved bookmarks, preparation checklists, and tracker notes stored in this browser session. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearMyData}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-sm"
              >
                Yes, Clear My Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
