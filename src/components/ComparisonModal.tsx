import React, { useEffect } from 'react';
import {
  Scholarship,
  StudentProfile,
  ScholarshipUserData,
  ApplicationStage
} from '../types';
import { calculateMatch } from '../utils/matching';
import {
  X,
  Scale,
  Sparkles,
  BookmarkCheck,
  Bookmark,
  ChevronRight
} from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  scholarships: Scholarship[];
  profile: StudentProfile;
  userData: Record<string, ScholarshipUserData>;
  onRemoveFromCompare: (id: string) => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
  onToggleSave: (id: string, e?: React.MouseEvent) => void;
  onStatusChange: (id: string, status: ApplicationStage) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  scholarships,
  profile,
  userData,
  onRemoveFromCompare,
  onSelectScholarship,
  onToggleSave,
  onStatusChange,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 z-10 overflow-hidden">

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-100 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="compare-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Compare Scholarship Opportunities
              </h2>
              <p className="text-xs text-stone-500">
                Comparing {scholarships.length} Indian schemes side-by-side against your profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition-colors"
            aria-label="Close comparison view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {scholarships.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-2">
              <p className="font-medium text-stone-700">No scholarships selected for comparison.</p>
              <p className="text-xs">Click the "Compare" button on any opportunity card in discovery to compare up to 3 schemes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scholarships.map((s) => {
                const match = calculateMatch(s, profile);
                const user = userData[s.id] || {
                  status: 'none' as ApplicationStage,
                  isSaved: false,
                  completedChecklist: [],
                  notes: '',
                  updatedAt: ''
                };
                return (
                  <div
                    key={s.id}
                    className="bg-[#FAF9F5] rounded-2xl border border-stone-200 p-5 flex flex-col justify-between space-y-5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-stone-500 truncate max-w-[170px]">
                          {s.provider}
                        </span>
                        <button
                          onClick={() => onRemoveFromCompare(s.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove from comparison"
                          aria-label={`Remove ${s.name} from comparison`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-serif font-bold text-base text-stone-900 leading-snug mb-3">
                        {s.name}
                      </h3>

                      {/* Match Status Badge */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-3 ${
                        match.category === 'likely'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : match.category === 'possible'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{match.headline}</span>
                      </div>

                      {/* Criteria Grid */}
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                          <span className="text-stone-500">Award:</span>
                          <span className="font-bold text-emerald-900">{s.awardDisplay}</span>
                        </div>

                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                          <span className="text-stone-500">Frequency:</span>
                          <span className="font-semibold text-stone-800">{s.awardFrequency}</span>
                        </div>

                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                          <span className="text-stone-500">Deadline:</span>
                          <span className="font-semibold text-stone-800">{s.deadlineDisplay}</span>
                        </div>

                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                          <span className="text-stone-500">Income Limit:</span>
                          <span className="font-semibold text-stone-800">
                            {s.maxAnnualIncomeRupees ? `₹${s.maxAnnualIncomeRupees.toLocaleString('en-IN')}` : 'None'}
                          </span>
                        </div>

                        <div className="pb-2 border-b border-stone-200">
                          <span className="text-stone-500 block mb-1">Where to Apply:</span>
                          <span className="font-semibold text-stone-800 block truncate">{s.applicationUrl && s.applicationUrlVerified && s.applicationStatus !== 'Closed' ? `Apply through ${s.applicationPlatformName}` : 'Not verified / unavailable for this cycle'}</span>
                        </div>

                        <div className="pb-2 border-b border-stone-200">
                          <span className="text-stone-500 block mb-1">Required Documents:</span>
                          <ul className="list-disc list-inside text-stone-700 space-y-0.5">
                            {s.confirmedDocuments.slice(0, 3).map((doc, idx) => (
                              <li key={idx} className="truncate">{doc}</li>
                            ))}
                            {s.confirmedDocuments.length > 3 && (
                              <li className="text-[11px] text-stone-400">+{s.confirmedDocuments.length - 3} more</li>
                            )}
                          </ul>
                        </div>

                        <div>
                          <span className="text-stone-500 block mb-1">Application Stage:</span>
                          <select
                            value={user.status}
                            onChange={(e) => onStatusChange(s.id, e.target.value as ApplicationStage)}
                            className="w-full text-xs font-semibold p-2 rounded-xl border border-stone-300 bg-white"
                          >
                            <option value="none">Not Tracking</option>
                            <option value="interested">Stage: Interested</option>
                            <option value="preparing">Stage: Preparing Documents</option>
                            <option value="started">Stage: Started on Portal</option>
                            <option value="submitted">Stage: Submitted</option>
                            <option value="awaiting_result">Stage: Awaiting Result</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => onToggleSave(s.id, e)}
                        className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1 ${
                          user.isSaved
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {user.isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-700 fill-amber-700" /> : <Bookmark className="w-4 h-4 text-stone-500" />}
                        <span>{user.isSaved ? 'Saved' : 'Save'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectScholarship(s);
                        }}
                        className="px-3.5 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <span>Full Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF9F5] border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Guidance only. Confirm details on the official provider portal before applying.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
