import React, { useState, useMemo } from 'react';
import {
  Scholarship,
  StudentProfile,
  ScholarshipUserData,
  ApplicationStage
} from '../types';
import { calculateMatch } from '../utils/matching';
import {
  CheckSquare,
  Bookmark,
  FileCheck2,
  Trash2,
  ChevronRight,
  Compass,
  Copy,
  Search,
  Info
} from 'lucide-react';

interface TrackerViewProps {
  scholarships: Scholarship[];
  profile: StudentProfile;
  userData: Record<string, ScholarshipUserData>;
  initialTab?: 'tracker' | 'saved';
  onSelectScholarship: (scholarship: Scholarship) => void;
  onToggleSave: (id: string) => void;
  onStatusChange: (id: string, status: ApplicationStage) => void;
  onNavigateToDiscovery: () => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({
  scholarships,
  profile,
  userData,
  initialTab = 'tracker',
  onSelectScholarship,
  onToggleSave,
  onStatusChange,
  onNavigateToDiscovery,
}) => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'saved'>(initialTab);
  const [trackerSearch, setTrackerSearch] = useState('');
  const [copiedSummaryToast, setCopiedSummaryToast] = useState(false);

  // Map of scholarships by id
  const scholarshipMap = useMemo(() => {
    return new Map(scholarships.map(s => [s.id, s]));
  }, [scholarships]);

  // Grouped by the 5 official stages
  const getStageItems = (stage: ApplicationStage) => {
    return Object.entries(userData)
      .filter(([_, data]) => data.status === stage)
      .map(([id, data]) => ({ scholarship: scholarshipMap.get(id), data }))
      .filter((item): item is { scholarship: Scholarship; data: ScholarshipUserData } => Boolean(item.scholarship))
      .filter(item => !trackerSearch || item.scholarship.name.toLowerCase().includes(trackerSearch.toLowerCase()));
  };

  const interestedItems = useMemo(() => getStageItems('interested'), [userData, scholarshipMap, trackerSearch]);
  const preparingItems = useMemo(() => getStageItems('preparing'), [userData, scholarshipMap, trackerSearch]);
  const startedItems = useMemo(() => getStageItems('started'), [userData, scholarshipMap, trackerSearch]);
  const submittedItems = useMemo(() => getStageItems('submitted'), [userData, scholarshipMap, trackerSearch]);
  const awaitingItems = useMemo(() => getStageItems('awaiting_result'), [userData, scholarshipMap, trackerSearch]);

  const totalTrackedCount = interestedItems.length + preparingItems.length + startedItems.length + submittedItems.length + awaitingItems.length;

  // Saved bookmarks
  const savedItems = useMemo(() => {
    return Object.entries(userData)
      .filter(([_, data]) => data.isSaved)
      .map(([id, data]) => ({ scholarship: scholarshipMap.get(id), data }))
      .filter((item): item is { scholarship: Scholarship; data: ScholarshipUserData } => Boolean(item.scholarship))
      .filter(item => !trackerSearch || item.scholarship.name.toLowerCase().includes(trackerSearch.toLowerCase()));
  }, [userData, scholarshipMap, trackerSearch]);

  // Total potential aid in Rupees
  const totalTrackedPotentialRupees = useMemo(() => {
    const allTrackedIds = new Set(
      Object.entries(userData)
        .filter(([_, d]) => d.status !== 'none')
        .map(([id]) => id)
    );
    return Array.from(allTrackedIds).reduce((acc, id) => {
      const s = scholarshipMap.get(id);
      return acc + (s ? s.awardAmountRupees : 0);
    }, 0);
  }, [userData, scholarshipMap]);

  // Copy preparation report to clipboard
  const handleCopyDossier = () => {
    const allTracked = [
      ...interestedItems.map(i => ({ ...i, stageName: 'Interested' })),
      ...preparingItems.map(i => ({ ...i, stageName: 'Preparing Documents' })),
      ...startedItems.map(i => ({ ...i, stageName: 'Started on Portal' })),
      ...submittedItems.map(i => ({ ...i, stageName: 'Submitted' })),
      ...awaitingItems.map(i => ({ ...i, stageName: 'Awaiting Result' }))
    ];

    const dossier = `# 🎓 ScholarPath India — Application Tracker Report
Student: ${profile.fullName || 'Student'}
Education Stage: ${profile.educationStage || 'Not set'} | Stream: ${profile.courseField || 'Not set'}
Total Tracked Potential Aid: ₹${totalTrackedPotentialRupees.toLocaleString('en-IN')}
Report Date: ${new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}

Notice: Tracker statuses are personal notes stored in your browser and are not synced with official scholarship providers.

---
${allTracked.map(item => `
### [${item.stageName.toUpperCase()}] ${item.scholarship.name}
- Provider: ${item.scholarship.provider}
- Award: ${item.scholarship.awardDisplay} (${item.scholarship.awardFrequency})
- Deadline: ${item.scholarship.deadlineDisplay} (${item.scholarship.applicationStatus})
- Application Destination: ${item.scholarship.applicationUrl && item.scholarship.applicationUrlVerified && item.scholarship.applicationStatus !== 'Closed' ? `Apply through ${item.scholarship.applicationPlatformName}` : 'Not verified / unavailable for this cycle'}
- Tasks Done: ${item.data.completedChecklist.length}/${item.scholarship.preparationChecklist.length + (item.data.customTasks?.length || 0)}
- Student Notes: ${item.data.notes || 'None recorded'}
`).join('\n')}
`;

    navigator.clipboard.writeText(dossier).then(() => {
      setCopiedSummaryToast(true);
      setTimeout(() => setCopiedSummaryToast(false), 3000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">

      {/* View Header with Sub-tabs & Copy Report */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Application Tracker & Saved Items
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Organize personal deadlines, track document readiness, and record application milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sub-tab Pill Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tracker'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Application Pipeline ({totalTrackedCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'saved'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Bookmarks ({savedItems.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyDossier}
            title="Copy formatted markdown report of all tracked scholarships"
            className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold border border-stone-300 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-700" />
            <span>{copiedSummaryToast ? 'Dossier Copied!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Honest Provider Disclaimer Callout */}
      <div className="bg-[#FAF9F5] border border-stone-300 rounded-2xl p-3.5 text-xs text-stone-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <strong>Personal Tracker Notice:</strong> Tracker statuses and checklists are personal notes stored strictly in your browser. They are not submitted to or synchronized with official scholarship providers or government portals.
        </div>
      </div>

      {/* Summary Metrics Bar in Indian Rupees */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div className="sm:col-span-2 border-r border-stone-100 pr-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Total Potential Aid Tracked</span>
          <span className="font-serif text-xl sm:text-2xl font-bold text-emerald-900">
            ₹{totalTrackedPotentialRupees.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-stone-400 block">Across {totalTrackedCount} tracked applications</span>
        </div>

        <div className="border-r border-stone-100 pr-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">1. Interested</span>
          <span className="font-serif text-xl font-bold text-stone-900">{interestedItems.length}</span>
        </div>

        <div className="border-r border-stone-100 pr-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">2. Preparing</span>
          <span className="font-serif text-xl font-bold text-stone-900">{preparingItems.length}</span>
        </div>

        <div className="border-r border-stone-100 pr-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">3. Started</span>
          <span className="font-serif text-xl font-bold text-stone-900">{startedItems.length}</span>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">4. Submitted</span>
          <span className="font-serif text-xl font-bold text-emerald-800">{submittedItems.length}</span>
        </div>
      </div>

      {/* Search within tracker */}
      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter tracked schemes by name..."
          value={trackerSearch}
          onChange={(e) => setTrackerSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />
      </div>

      {/* TAB 1: KANBAN 5-STAGE PIPELINE */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {/* Stage 1: Interested */}
            <div className="bg-[#FAF9F5] rounded-2xl border border-stone-200/90 p-3.5 flex flex-col min-h-[360px]">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-200 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <h3 className="font-serif font-bold text-stone-900 text-xs">Interested</h3>
                </div>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full">
                  {interestedItems.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {interestedItems.length > 0 ? (
                  interestedItems.map(({ scholarship, data }) => (
                    <TrackerCard
                      key={scholarship.id}
                      scholarship={scholarship}
                      profile={profile}
                      userData={data}
                      onSelect={() => onSelectScholarship(scholarship)}
                      onMoveForward={() => onStatusChange(scholarship.id, 'preparing')}
                      onMoveBackward={() => onStatusChange(scholarship.id, 'none')}
                      forwardLabel="Start Prep &rarr;"
                      backwardLabel="Remove"
                    />
                  ))
                ) : (
                  <p className="text-[11px] text-stone-400 text-center py-8 italic">No items in Interested stage</p>
                )}
              </div>
            </div>

            {/* Stage 2: Preparing */}
            <div className="bg-[#FAF9F5] rounded-2xl border border-stone-200/90 p-3.5 flex flex-col min-h-[360px]">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-200 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <h3 className="font-serif font-bold text-stone-900 text-xs">Preparing</h3>
                </div>
                <span className="text-[11px] font-bold bg-purple-100 text-purple-900 px-2 py-0.2 rounded-full">
                  {preparingItems.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {preparingItems.length > 0 ? (
                  preparingItems.map(({ scholarship, data }) => (
                    <TrackerCard
                      key={scholarship.id}
                      scholarship={scholarship}
                      profile={profile}
                      userData={data}
                      onSelect={() => onSelectScholarship(scholarship)}
                      onMoveForward={() => onStatusChange(scholarship.id, 'started')}
                      onMoveBackward={() => onStatusChange(scholarship.id, 'interested')}
                      forwardLabel="Portal Started &rarr;"
                      backwardLabel="&larr; Back"
                    />
                  ))
                ) : (
                  <p className="text-[11px] text-stone-400 text-center py-8 italic">No items in Preparing stage</p>
                )}
              </div>
            </div>

            {/* Stage 3: Started */}
            <div className="bg-[#FAF9F5] rounded-2xl border border-stone-200/90 p-3.5 flex flex-col min-h-[360px]">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-200 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <h3 className="font-serif font-bold text-stone-900 text-xs">Started</h3>
                </div>
                <span className="text-[11px] font-bold bg-sky-100 text-sky-900 px-2 py-0.2 rounded-full">
                  {startedItems.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {startedItems.length > 0 ? (
                  startedItems.map(({ scholarship, data }) => (
                    <TrackerCard
                      key={scholarship.id}
                      scholarship={scholarship}
                      profile={profile}
                      userData={data}
                      onSelect={() => onSelectScholarship(scholarship)}
                      onMoveForward={() => onStatusChange(scholarship.id, 'submitted')}
                      onMoveBackward={() => onStatusChange(scholarship.id, 'preparing')}
                      forwardLabel="Mark Submitted &check;"
                      backwardLabel="&larr; Back"
                    />
                  ))
                ) : (
                  <p className="text-[11px] text-stone-400 text-center py-8 italic">No items in Started stage</p>
                )}
              </div>
            </div>

            {/* Stage 4: Submitted */}
            <div className="bg-[#FAF9F5] rounded-2xl border border-stone-200/90 p-3.5 flex flex-col min-h-[360px]">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-200 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <h3 className="font-serif font-bold text-stone-900 text-xs">Submitted</h3>
                </div>
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.2 rounded-full">
                  {submittedItems.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {submittedItems.length > 0 ? (
                  submittedItems.map(({ scholarship, data }) => (
                    <TrackerCard
                      key={scholarship.id}
                      scholarship={scholarship}
                      profile={profile}
                      userData={data}
                      onSelect={() => onSelectScholarship(scholarship)}
                      onMoveForward={() => onStatusChange(scholarship.id, 'awaiting_result')}
                      onMoveBackward={() => onStatusChange(scholarship.id, 'started')}
                      forwardLabel="Awaiting &rarr;"
                      backwardLabel="&larr; Back"
                    />
                  ))
                ) : (
                  <p className="text-[11px] text-stone-400 text-center py-8 italic">No submitted items yet</p>
                )}
              </div>
            </div>

            {/* Stage 5: Awaiting Result */}
            <div className="bg-[#FAF9F5] rounded-2xl border border-stone-200/90 p-3.5 flex flex-col min-h-[360px]">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-200 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <h3 className="font-serif font-bold text-stone-900 text-xs">Awaiting Result</h3>
                </div>
                <span className="text-[11px] font-bold bg-indigo-100 text-indigo-900 px-2 py-0.2 rounded-full">
                  {awaitingItems.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {awaitingItems.length > 0 ? (
                  awaitingItems.map(({ scholarship, data }) => (
                    <TrackerCard
                      key={scholarship.id}
                      scholarship={scholarship}
                      profile={profile}
                      userData={data}
                      onSelect={() => onSelectScholarship(scholarship)}
                      onMoveBackward={() => onStatusChange(scholarship.id, 'submitted')}
                      backwardLabel="&larr; Re-open"
                    />
                  ))
                ) : (
                  <p className="text-[11px] text-stone-400 text-center py-8 italic">No applications awaiting result</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: SAVED BOOKMARKS LIST */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedItems.map(({ scholarship, data }) => {
                const match = calculateMatch(scholarship, profile);
                return (
                  <div
                    key={scholarship.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-stone-500 truncate max-w-[180px]">
                          {scholarship.provider}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          match.category === 'likely'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : match.category === 'possible'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {match.category === 'likely' ? 'Likely Match' : match.category === 'possible' ? 'Check Details' : 'Mismatch'}
                        </span>
                      </div>

                      <h3
                        onClick={() => onSelectScholarship(scholarship)}
                        className="font-serif font-bold text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer mb-2 leading-snug"
                      >
                        {scholarship.name}
                      </h3>

                      <div className="flex items-center gap-3 text-xs mb-3">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {scholarship.awardDisplay}
                        </span>
                        <span className="text-stone-500">
                          {scholarship.deadlineDisplay}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                        {scholarship.summary}
                      </p>

                      <div className="text-[11px] text-stone-600 bg-stone-50 p-2 rounded border border-stone-200 mb-3 flex items-center justify-between">
                        <span><strong>{scholarship.applicationUrl && scholarship.applicationUrlVerified && scholarship.applicationStatus !== 'Closed' ? 'Apply through:' : 'Application destination:'}</strong> {scholarship.applicationUrl && scholarship.applicationUrlVerified && scholarship.applicationStatus !== 'Closed' ? scholarship.applicationPlatformName : 'Not verified / unavailable for this cycle'}</span>
                      </div>

                      {data.notes && (
                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-200 text-xs text-stone-700 italic mb-3">
                          "{data.notes}"
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onToggleSave(scholarship.id)}
                        className="text-xs text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Bookmark</span>
                      </button>

                      <button
                        onClick={() => onSelectScholarship(scholarship)}
                        className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-colors flex items-center gap-1"
                      >
                        <span>Open Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  No saved scholarships yet
                </h3>
                <p className="text-xs sm:text-sm text-stone-600">
                  Bookmark interesting opportunities in the catalog to review them here later.
                </p>
              </div>
              <button
                onClick={onNavigateToDiscovery}
                className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors shadow-sm inline-flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Indian Scholarships</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

interface TrackerCardProps {
  scholarship: Scholarship;
  profile: StudentProfile;
  userData: ScholarshipUserData;
  onSelect: () => void;
  onMoveForward?: () => void;
  onMoveBackward?: () => void;
  forwardLabel?: string;
  backwardLabel?: string;
}

const TrackerCard: React.FC<TrackerCardProps> = ({
  scholarship,
  userData,
  onSelect,
  onMoveForward,
  onMoveBackward,
  forwardLabel,
  backwardLabel,
}) => {
  const totalTasks = scholarship.preparationChecklist.length + (userData.customTasks?.length || 0);
  const completedTasks = userData.completedChecklist.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-sm hover:border-emerald-700/40 transition-all flex flex-col justify-between gap-2.5 text-xs">
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10px] font-semibold text-stone-500 truncate max-w-[120px]">
            {scholarship.provider}
          </span>
          <span className="text-[10px] font-bold text-emerald-800">
            {scholarship.awardDisplay}
          </span>
        </div>

        <h4
          onClick={onSelect}
          className="font-serif font-bold text-stone-900 text-xs hover:text-emerald-800 transition-colors cursor-pointer leading-snug line-clamp-2 mb-2"
        >
          {scholarship.name}
        </h4>

        {/* Checklist Progress */}
        {totalTasks > 0 && (
          <div className="space-y-1 mb-1.5">
            <div className="flex items-center justify-between text-[10px] text-stone-600">
              <span className="flex items-center gap-1">
                <FileCheck2 className="w-3 h-3 text-emerald-700" />
                <span>Tasks:</span>
              </span>
              <span className="font-semibold text-stone-800">
                {completedTasks}/{totalTasks} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {userData.notes && (
          <div className="text-[10px] text-stone-500 bg-stone-50 p-1.5 rounded border border-stone-200 truncate">
            {userData.notes}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1 text-[11px]">
        <button
          onClick={onSelect}
          className="text-emerald-900 hover:text-emerald-700 font-semibold underline underline-offset-2 text-[10px]"
        >
          Details
        </button>

        <div className="flex items-center gap-1">
          {onMoveBackward && backwardLabel && (
            <button
              onClick={onMoveBackward}
              className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-semibold transition-colors"
            >
              {backwardLabel}
            </button>
          )}

          {onMoveForward && forwardLabel && (
            <button
              onClick={onMoveForward}
              className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[10px] font-semibold transition-colors"
            >
              {forwardLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
