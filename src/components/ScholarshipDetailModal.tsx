import React, { useState, useEffect } from 'react';
import {
  Scholarship,
  StudentProfile,
  ScholarshipUserData,
  ApplicationStage
} from '../types';
import { calculateMatch } from '../utils/matching';
import {
  X,
  Building2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  ListOrdered,
  CheckSquare,
  Square,
  ExternalLink,
  ShieldCheck,
  Plus,
  MessageSquare,
  Copy,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  profile: StudentProfile;
  userData: ScholarshipUserData;
  isOpen: boolean;
  onClose: () => void;
  onToggleSave: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStage) => void;
  onToggleChecklistItem: (id: string, item: string) => void;
  onAddCustomChecklistItem: (id: string, item: string) => void;
  onRemoveCustomChecklistItem?: (id: string, item: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  profile,
  userData,
  isOpen,
  onClose,
  onToggleSave,
  onStatusChange,
  onToggleChecklistItem,
  onAddCustomChecklistItem,
  onRemoveCustomChecklistItem,
  onSaveNotes,
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

  const [newChecklistText, setNewChecklistText] = useState('');
  const [notesText, setNotesText] = useState(userData?.notes || '');
  const [notesSavedToast, setNotesSavedToast] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    if (userData?.notes !== undefined) {
      setNotesText(userData.notes);
    }
  }, [userData?.notes]);

  if (!isOpen || !scholarship) return null;

  const match = calculateMatch(scholarship, profile);

  // Combine preparation checklist items + user custom tasks
  const customTasks = userData.customTasks || [];
  const allChecklistItems = Array.from(
    new Set([...scholarship.preparationChecklist, ...customTasks])
  );

  const completedCount = allChecklistItems.filter(item =>
    userData.completedChecklist.includes(item)
  ).length;
  const progressPercent = allChecklistItems.length > 0
    ? Math.round((completedCount / allChecklistItems.length) * 100)
    : 0;

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistText.trim()) {
      onAddCustomChecklistItem(scholarship.id, newChecklistText.trim());
      setNewChecklistText('');
    }
  };

  const handleSaveNotes = () => {
    onSaveNotes(scholarship.id, notesText);
    setNotesSavedToast(true);
    setTimeout(() => setNotesSavedToast(false), 2500);
  };

  const handleCopySummary = () => {
    const summaryText = `🎓 ${scholarship.name}
Provider: ${scholarship.provider} (${scholarship.providerType})
Award: ${scholarship.awardDisplay} (${scholarship.awardFrequency})
Deadline: ${scholarship.deadlineDisplay} (${scholarship.applicationStatus})
Match Guidance: ${match.headline}

Confirmed Documents Required:
${scholarship.confirmedDocuments.map(d => `- ${d}`).join('\n')}

Preparation Checklist (${completedCount}/${allChecklistItems.length} completed):
${allChecklistItems.map(item => `[${userData.completedChecklist.includes(item) ? 'x' : ' '}] ${item}`).join('\n')}

Application Destination: ${scholarship.applicationUrl && scholarship.applicationUrlVerified && scholarship.applicationStatus !== 'Closed' ? `Apply through ${scholarship.applicationPlatformName}` : 'Not verified / unavailable for this cycle'}
Application Link: ${scholarship.applicationUrl && scholarship.applicationUrlVerified && scholarship.applicationStatus !== 'Closed' ? scholarship.applicationUrl : 'Not verified'}
Information Source: ${scholarship.infoSourceUrl}

Personal Notes:
${notesText || 'None recorded.'}
`;
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    });
  };

  // Helper to extract domain from URL safely
  const getDomainFromUrl = (urlStr: string) => {
    try {
      const u = new URL(urlStr);
      return u.hostname;
    } catch {
      return urlStr;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scholarship-detail-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 z-10 overflow-hidden">

        {/* Sticky Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-[#FAF9F5] flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                <Building2 className="w-3.5 h-3.5 text-stone-500" />
                {scholarship.provider}
              </span>
              <span className="text-xs text-stone-600 bg-cream-100 px-2 py-0.5 rounded border border-stone-200">
                {scholarship.providerType}
              </span>
              {scholarship.isDemoRecord && (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Demo Record
                </span>
              )}
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                match.category === 'likely'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : match.category === 'possible'
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}>
                {match.category === 'likely' ? 'Likely match' : match.category === 'possible' ? 'Needs checking' : 'Does not meet a listed requirement'}
              </span>
            </div>

            <h2 id="scholarship-detail-title" className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
              {scholarship.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-stone-800">

          {/* Key Facts Summary Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F4F6F0] p-4 rounded-2xl border border-emerald-900/10">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">Award & Frequency</span>
              <span className="text-xl font-serif font-bold text-emerald-900 flex items-center">
                {scholarship.awardDisplay}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold block">{scholarship.awardFrequency}</span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">Closing Deadline</span>
              <span className="text-sm font-bold text-stone-900 block mt-1">
                {scholarship.deadlineDisplay}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                scholarship.applicationStatus === 'Applications Open'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-200 text-stone-700'
              }`}>
                {scholarship.applicationStatus}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">Last Verified Date</span>
              <span className="text-sm font-semibold text-stone-800 block mt-1">
                {scholarship.lastCheckedDate}
              </span>
              <span className="text-[10px] text-stone-500">Checked against linked source on this date</span>
            </div>
          </div>

          {/* Honest Match Explanation Card */}
          <div className={`border rounded-2xl p-4 sm:p-5 ${
            match.category === 'likely'
              ? 'bg-emerald-50/70 border-emerald-200'
              : match.category === 'possible'
              ? 'bg-amber-50/70 border-amber-200'
              : 'bg-rose-50/70 border-rose-200'
          }`}>
            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
              {match.category === 'likely' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
              {match.category === 'possible' && <AlertCircle className="w-4 h-4 text-amber-700" />}
              {match.category === 'mismatch' && <XCircle className="w-4 h-4 text-rose-700" />}
              <span>Fit Analysis: {match.headline}</span>
            </div>

            {match.reasons.length > 0 && (
              <div className="space-y-1 mb-2.5">
                <span className="text-xs font-semibold text-stone-900 block">Criteria you satisfy:</span>
                <ul className="space-y-1">
                  {match.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {match.missingOrUnknown.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-stone-200/60 mb-2">
                <span className="text-xs font-semibold text-amber-950 block">Details to check or prepare:</span>
                <ul className="space-y-1">
                  {match.missingOrUnknown.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-amber-900">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {match.mismatchReasons.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-rose-200 text-xs text-rose-900">
                <span className="font-semibold block">Confirmed criteria mismatch:</span>
                {match.mismatchReasons.map((mm, i) => (
                  <p key={i}>&bull; {mm}</p>
                ))}
              </div>
            )}

            <p className="text-[11px] text-stone-500 italic mt-3 pt-2 border-t border-stone-200/50">
              {match.guidanceNotice}
            </p>
          </div>

          {/* Scheme Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Scheme Summary
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {scholarship.summary}
            </p>
          </div>

          {/* Eligibility Criteria Bullet Points */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Confirmed Scheme Eligibility
            </h4>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
              <ul className="space-y-1.5 text-stone-800">
                {scholarship.keyEligibilityList.map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-stone-200 text-stone-600">
                <div>
                  <span className="font-semibold block">Eligible Education Stages:</span>
                  <span>{scholarship.educationStages.join(', ')}</span>
                </div>
                <div>
                  <span className="font-semibold block">Applicable Streams:</span>
                  <span>{scholarship.courseFields.join(', ')}</span>
                </div>
                <div>
                  <span className="font-semibold block">Applicable Geography:</span>
                  <span>{scholarship.states.join(', ')}</span>
                </div>
                <div>
                  <span className="font-semibold block">Income Ceiling:</span>
                  <span>{scholarship.maxAnnualIncomeRupees ? `₹${scholarship.maxAnnualIncomeRupees.toLocaleString('en-IN')} / year` : 'No ceiling specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmed Required Documents */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-800" />
              <span>Confirmed Required Documents</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scholarship.confirmedDocuments.length === 0 && <li className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">Not verified for this cycle. Check the official information page.</li>}
              {scholarship.confirmedDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-stone-200">
                  <span className="w-5 h-5 rounded-md bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-stone-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-emerald-800" />
              <span>Confirmed Application Steps</span>
            </h4>
            <div className="space-y-2">
              {scholarship.applicationSteps.length === 0 && <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">Application steps for this cycle are not verified. Follow the linked portal instructions.</p>}
              {scholarship.applicationSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-stone-700 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* INTERACTIVE PREPARATION CHECKLIST */}
          <div className="bg-[#FAF8F2] border-2 border-emerald-900/15 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-800" />
                  <span>Student Preparation Checklist</span>
                </h4>
                <p className="text-xs text-stone-500">
                  Your checklist is personal progress, stored only in this browser. It is not synced with the provider. Requirements are added only when confirmed.
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm">
                <div className="w-20 bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-emerald-900">
                  {completedCount}/{allChecklistItems.length} ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Checklist List */}
            <div className="space-y-2 mb-4">
              {allChecklistItems.length === 0 && <p className="text-xs text-stone-600 bg-white border border-stone-200 rounded-xl p-3">No confirmed checklist requirements are available yet. Any reminder you add is a personal suggestion, not an official requirement.</p>}
              {allChecklistItems.map((item, idx) => {
                const isChecked = userData.completedChecklist.includes(item);
                const isCustom = customTasks.includes(item);
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all select-none ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : 'bg-white border-stone-200 hover:border-emerald-600/40 text-stone-800'
                    }`}
                  >
                    <div
                      onClick={() => onToggleChecklistItem(scholarship.id, item)}
                      className="flex items-start gap-3 cursor-pointer flex-1"
                    >
                      <button
                        type="button"
                        aria-label={isChecked ? `Uncheck ${item}` : `Check ${item}`}
                        className="mt-0.5 shrink-0"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-700" />
                        ) : (
                          <Square className="w-5 h-5 text-stone-400" />
                        )}
                      </button>
                      <span className={`text-xs ${isChecked ? 'line-through text-stone-500 font-medium' : ''}`}>
                        {item} {isCustom && <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded ml-1">Custom Task</span>}
                      </span>
                    </div>

                    {isCustom && onRemoveCustomChecklistItem && (
                      <button
                        onClick={() => onRemoveCustomChecklistItem(scholarship.id, item)}
                        className="text-stone-400 hover:text-rose-600 p-1 ml-2 transition-colors"
                        title="Remove custom task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Custom Task Form */}
            <form onSubmit={handleAddChecklist} className="flex gap-2">
              <input
                type="text"
                placeholder="Add your own preparation reminder..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
              <button
                type="submit"
                disabled={!newChecklistText.trim()}
                className="px-3.5 py-2 bg-stone-800 text-white text-xs font-semibold rounded-xl hover:bg-stone-900 disabled:opacity-50 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </form>
          </div>

          {/* Student Private Notes */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="student-notes" className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-800" />
                <span>My Private Notes for this Opportunity</span>
              </label>
              {notesSavedToast && (
                <span className="text-xs font-semibold text-emerald-700 animate-fade-in flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Notes saved!
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mb-2">
              Personal reminders stay in this browser only. Avoid adding passwords, government IDs, bank details, or other sensitive information.
            </p>
            <textarea
              id="student-notes"
              rows={3}
              placeholder="Record your application registration number, verification dates, or queries here..."
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
            />
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="text-xs text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedToast ? 'Summary copied to clipboard!' : 'Copy Preparation Plan'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3.5 py-1.5 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-900 transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>

          {/* APPLICATION DESTINATION & INFORMATION SOURCE (STRICTLY SEPARATED) */}
          <div className="rounded-2xl border p-5 bg-[#FAF9F5] border-stone-200 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>Where to Apply & Official Information Sources</span>
              </h4>
              <p className="text-xs text-stone-600">
                ScholarPath never submits an application on your behalf. We direct you directly to the verified official portal.
              </p>
            </div>

            {/* 1. Official Application Destination */}
            <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                  1. Official Application Destination
                </span>
                <span className="text-[11px] text-stone-500">
                  Domain: <strong className="text-stone-800">{scholarship.applicationUrl ? getDomainFromUrl(scholarship.applicationUrl) : 'Unverified'}</strong>
                </span>
              </div>

              {scholarship.applicationUrl && scholarship.applicationUrlVerified && scholarship.applicationStatus !== 'Closed' ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div>
                    <h5 className="font-semibold text-sm text-stone-900">{scholarship.applicationPlatformName}</h5>
                    <p className="text-xs text-stone-500">
                      Opens {getDomainFromUrl(scholarship.applicationUrl)} in a new tab. ScholarPath does not submit applications.
                    </p>
                  </div>
                  <a
                    href={scholarship.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shadow-sm shrink-0"
                  >
                      <span>Apply through {scholarship.applicationPlatformName} ↗</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>{scholarship.applicationStatus === 'Closed' ? 'Applications are closed for this cycle.' : 'Application link not verified.'}</strong> No Apply button is shown. Please consult the official information source below.
                  </div>
                </div>
              )}
            </div>

            {/* 2. Confirmed Information Source */}
            <div className="p-3 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-stone-500 block text-[11px]">Official information:</span>
                <span className="font-semibold text-stone-900 block">{scholarship.infoSourceLabel}</span>
                <span className="text-stone-400 text-[11px] truncate block max-w-sm">{scholarship.infoSourceUrl}</span>
              </div>
              <a
                href={scholarship.infoSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-2 shrink-0"
              >
                <span>Open official information ↗</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {scholarship.statusSourceUrl && (
              <div className="p-3 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px]">Current-cycle status listing:</span>
                  <span className="font-semibold text-stone-900 block">{scholarship.statusSourceLabel}</span>
                </div>
                <a href={scholarship.statusSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-2 shrink-0">
                  <span>Open NSP listing ↗</span><ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Verification Note */}
            <div className="text-[11px] text-stone-500 pt-1">
              <strong>Source Verification Note:</strong> {scholarship.sourceVerificationNote}
            </div>

            <p className="text-[11px] text-stone-500 italic">
              Demo information only. Confirm current details with the official provider before applying. Scholarship information can change. Confirm eligibility, deadlines, and application instructions on the linked provider or application portal. A match does not guarantee an award.
            </p>
          </div>

        </div>

        {/* Modal Sticky Bottom Bar */}
        <div className="p-4 sm:p-5 bg-[#FAF9F5] border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          {/* Status Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">Personal Stage:</span>
            <select
              value={userData.status}
              onChange={(e) => onStatusChange(scholarship.id, e.target.value as ApplicationStage)}
              className="text-xs font-semibold rounded-xl px-3 py-2 border border-stone-300 bg-white shadow-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            >
              <option value="none">Not Tracking</option>
              <option value="interested">Stage: Interested</option>
              <option value="preparing">Stage: Preparing Documents</option>
              <option value="started">Stage: Started on Portal</option>
              <option value="submitted">Stage: Submitted</option>
              <option value="awaiting_result">Stage: Awaiting Result</option>
            </select>
          </div>

          {/* Save Button & Done */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(scholarship.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                userData.isSaved
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              {userData.isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-700 fill-amber-700" />
                  <span>Saved in List</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-stone-600" />
                  <span>Save Opportunity</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
