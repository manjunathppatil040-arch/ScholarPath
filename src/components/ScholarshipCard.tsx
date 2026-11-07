import React from 'react';
import {
  Scholarship,
  StudentProfile,
  ScholarshipUserData,
  ApplicationStage
} from '../types';
import { calculateMatch } from '../utils/matching';
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  ChevronRight,
  Building2,
  FileCheck2,
  ExternalLink,
  Scale
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  profile: StudentProfile;
  userData: ScholarshipUserData;
  isComparing?: boolean;
  onSelect: (scholarship: Scholarship) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onStatusChange: (id: string, status: ApplicationStage, e: React.MouseEvent) => void;
  onToggleCompare?: (id: string, e: React.MouseEvent) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  profile,
  userData,
  isComparing = false,
  onSelect,
  onToggleSave,
  onStatusChange,
  onToggleCompare,
}) => {
  const match = calculateMatch(scholarship, profile);

  // Calculate days remaining
  const totalTasks = scholarship.preparationChecklist.length + (userData.customTasks?.length || 0);
  const completedTasks = userData.completedChecklist.length;

  return (
    <article
      onClick={() => onSelect(scholarship)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(scholarship);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${scholarship.name} by ${scholarship.provider}`}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-700/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      <div className="p-5 sm:p-6 pb-4">
        {/* Top Provider & Match Status Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
              <Building2 className="w-3.5 h-3.5 text-stone-500" />
              <span className="truncate max-w-[180px]">{scholarship.provider}</span>
            </span>

            {scholarship.isDemoRecord && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                Demo Entry
              </span>
            )}
          </div>

          {/* Honest Match Badge */}
          <div
            title={match.headline}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors shrink-0 ${
              match.category === 'likely'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : match.category === 'possible'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {match.category === 'likely' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            {match.category === 'possible' && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
            {match.category === 'mismatch' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
            <span>
              {match.category === 'likely' ? 'Likely match' : match.category === 'possible' ? 'Needs checking' : 'Does not meet a listed requirement'}
            </span>
          </div>
        </div>

        {/* Opportunity Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-emerald-900 transition-colors leading-snug mb-2">
          {scholarship.name}
        </h3>

        {/* Core Quick Facts: Award in Rupees & Application Status */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mb-3 text-xs sm:text-sm">
          {/* Award Amount */}
          <div className="flex items-center gap-1 font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span>{scholarship.awardDisplay}</span>
          </div>

          {/* Application Status Badge */}
          <div className={`px-2 py-0.5 rounded text-xs font-semibold border ${
            scholarship.applicationStatus === 'Applications Open'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : scholarship.applicationStatus === 'Upcoming'
              ? 'bg-sky-100 text-sky-900 border-sky-300'
              : scholarship.applicationStatus === 'Closed'
              ? 'bg-stone-100 text-stone-600 border-stone-200'
              : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}>
            {scholarship.applicationStatus}
          </div>

          {/* Deadline with Year */}
          <div className="flex items-center gap-1 text-stone-600 text-xs">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>
              Deadline: {scholarship.deadlineDisplay}
            </span>
          </div>
        </div>

        {/* Key Eligibility Snippet */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
          {scholarship.summary}
        </p>

        {/* Honest Match Guidance Box */}
        <div className={`rounded-xl p-3 mb-3 border text-xs ${
          match.category === 'likely'
            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
            : match.category === 'possible'
            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
            : 'bg-rose-50/70 border-rose-200 text-rose-950'
        }`}>
          <div className="font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{match.headline}</span>
          </div>

          {match.reasons.length > 0 && (
            <p className="text-[11px] opacity-90 line-clamp-1">
              &bull; {match.reasons.slice(0, 2).join(' &bull; ')}
            </p>
          )}

          {match.missingOrUnknown.length > 0 && match.category !== 'mismatch' && (
            <p className="text-[11px] opacity-90 font-medium line-clamp-1 mt-0.5">
              &bull; To verify: {match.missingOrUnknown[0]}
            </p>
          )}

          {match.mismatchReasons.length > 0 && (
            <p className="text-[11px] text-rose-800 font-medium line-clamp-1 mt-0.5">
              &bull; {match.mismatchReasons[0]}
            </p>
          )}
        </div>

        {/* Where to Apply Destination Label */}
        <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-3 bg-[#FAF9F5] p-2 rounded-lg border border-stone-200">
          <ExternalLink className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="truncate">
            <strong className="text-stone-800">{scholarship.applicationUrl && scholarship.applicationUrlVerified && scholarship.applicationStatus !== 'Closed' ? 'Apply through:' : 'Application destination:'}</strong> {scholarship.applicationUrl && scholarship.applicationUrlVerified && scholarship.applicationStatus !== 'Closed' ? scholarship.applicationPlatformName : 'Not verified / unavailable for this cycle'}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          {scholarship.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200"
            >
              #{tag}
            </span>
          ))}
          <span className="text-[11px] font-medium bg-cream-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
            {scholarship.awardType}
          </span>
        </div>
        <p className="mt-3 text-[10px] text-stone-500">Official source: {scholarship.infoSourceLabel} · Checked {scholarship.lastCheckedDate}. Open details for the source link.</p>
      </div>

      {/* Checklist Progress if active */}
      {userData.status !== 'none' && totalTasks > 0 && (
        <div className="px-5 sm:px-6 py-2 bg-emerald-50/50 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Preparation tasks:</span>
          </div>
          <span className="font-bold">
            {completedTasks} of {totalTasks} done ({Math.round((completedTasks / totalTasks) * 100)}%)
          </span>
        </div>
      )}

      {/* Footer Actions */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="px-5 sm:px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2"
      >
        {/* Stage Selector */}
        <div className="flex items-center gap-1.5">
          <label htmlFor={`stage-${scholarship.id}`} className="sr-only">Personal Application Stage</label>
          <select
            id={`stage-${scholarship.id}`}
            value={userData.status}
            onChange={(e) => onStatusChange(scholarship.id, e.target.value as ApplicationStage, e as any)}
            className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer ${
              userData.status === 'submitted'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : userData.status === 'started'
                ? 'bg-sky-100 text-sky-900 border-sky-300'
                : userData.status === 'preparing'
                ? 'bg-purple-100 text-purple-900 border-purple-300'
                : userData.status === 'interested'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : userData.status === 'awaiting_result'
                ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
            }`}
          >
            <option value="none">Not Tracking</option>
            <option value="interested">Stage: Interested</option>
            <option value="preparing">Stage: Preparing Documents</option>
            <option value="started">Stage: Started on Portal</option>
            <option value="submitted">Stage: Submitted</option>
            <option value="awaiting_result">Stage: Awaiting Result</option>
          </select>
        </div>

        {/* Buttons: Compare, Save, Details */}
        <div className="flex items-center gap-1.5">
          {onToggleCompare && (
            <button
              type="button"
              onClick={(e) => onToggleCompare(scholarship.id, e)}
              title={isComparing ? 'Remove from comparison' : 'Compare opportunity'}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
                isComparing
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-white text-stone-600 border-stone-300 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">{isComparing ? 'Comparing' : 'Compare'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => onToggleSave(scholarship.id, e)}
            aria-label={userData.isSaved ? 'Remove from saved' : 'Save scholarship'}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
              userData.isSaved
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-white text-stone-600 border-stone-300 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {userData.isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-700 fill-amber-700" />
                <span className="hidden sm:inline text-xs font-semibold">Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-stone-500" />
                <span className="hidden sm:inline text-xs">Save</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelect(scholarship)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors shadow-sm"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
