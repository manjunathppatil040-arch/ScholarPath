import React, { useMemo } from 'react';
import {
  Scholarship,
  StudentProfile,
  ScholarshipUserData,
  ApplicationStage
} from '../types';
import { calculateMatch } from '../utils/matching';
import {
  Sparkles,
  Compass,
  Bookmark,
  CheckSquare,
  ArrowRight,
  GraduationCap,
  ChevronRight,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface DashboardProps {
  scholarships: Scholarship[];
  profile: StudentProfile;
  userData: Record<string, ScholarshipUserData>;
  onNavigateToDiscovery: () => void;
  onNavigateToTracker: () => void;
  onNavigateToSaved: () => void;
  onNavigateToProfile: () => void;
  onTryDemo: () => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onStatusChange: (id: string, status: ApplicationStage, e: React.MouseEvent) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  scholarships,
  profile,
  userData,
  onNavigateToDiscovery,
  onNavigateToTracker,
  onNavigateToSaved,
  onNavigateToProfile,
  onTryDemo,
  onSelectScholarship,
}) => {
  // Compute match for all Indian scholarships
  const evaluatedScholarships = useMemo(() => {
    return scholarships.map(s => ({
      scholarship: s,
      match: calculateMatch(s, profile),
      data: userData[s.id] || {
        status: 'none' as ApplicationStage,
        isSaved: false,
        completedChecklist: [],
        notes: '',
        updatedAt: ''
      }
    })).sort((a, b) => {
      const weight = { likely: 3, possible: 2, mismatch: 1 };
      const diff = weight[b.match.category] - weight[a.match.category];
      if (diff !== 0) return diff;
      return b.scholarship.awardAmountRupees - a.scholarship.awardAmountRupees;
    });
  }, [scholarships, profile, userData]);

  // Counts strictly calculated from real app data
  const likelyMatches = evaluatedScholarships.filter(item => item.match.category === 'likely');
  const savedCount = Object.values(userData).filter(d => d.isSaved).length;

  const interestedCount = Object.values(userData).filter(d => d.status === 'interested').length;
  const preparingCount = Object.values(userData).filter(d => d.status === 'preparing').length;
  const startedCount = Object.values(userData).filter(d => d.status === 'started').length;
  const submittedCount = Object.values(userData).filter(d => d.status === 'submitted').length;
  const awaitingCount = Object.values(userData).filter(d => d.status === 'awaiting_result').length;
  const totalTracked = interestedCount + preparingCount + startedCount + submittedCount + awaitingCount;

  // Tracked scholarships
  const activeTrackedItems = useMemo(() => {
    return evaluatedScholarships.filter(item => item.data.status !== 'none').slice(0, 3);
  }, [evaluatedScholarships]);

  // Upcoming deadlines in tracked items
  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    return evaluatedScholarships
      .filter(item => item.data.status !== 'none' && item.data.status !== 'submitted' && item.data.status !== 'awaiting_result' && item.scholarship.applicationStatus === 'Applications Open')
      .map(item => {
        const d = new Date(item.scholarship.deadline);
        const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { ...item, diffDays };
      })
      .filter(item => item.diffDays > 0 && item.diffDays <= 45)
      .sort((a, b) => a.diffDays - b.diffDays);
  }, [evaluatedScholarships]);

  // Top 3 Recommended
  const topRecommendations = evaluatedScholarships.slice(0, 3);

  const greetingName = profile.fullName ? profile.fullName.split(' ')[0] : 'Student';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">

      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Honest Indian Scholarship Discovery</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-cream-50 leading-[1.15]">
            Namaste, {greetingName}. Let’s find the right aid for you.
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Quickly answer four key questions: <em>Is this likely to fit me? What documents should I prepare? When is the deadline? Where do I apply?</em>
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={profile.educationStage ? onNavigateToDiscovery : onNavigateToProfile}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-2xl text-sm transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2 transform active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>{profile.educationStage ? 'Find Scholarships for Me' : 'Set Up My Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={profile.educationStage ? onNavigateToProfile : onTryDemo}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-cream-100 font-semibold rounded-2xl text-sm transition-all border border-white/15 flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>{profile.educationStage ? 'Update Student Profile' : 'Explore with Demo Profile'}</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-10 w-40 h-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
      </section>

      {/* Mandatory Advisory Notice */}
      <div className="bg-[#FAF8F2] border border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Student Guidance Notice:</strong> Scholarship information can change. Confirm eligibility, deadlines, and application instructions on the linked provider or application portal. A match does not guarantee an award.
        </div>
      </div>

      {/* Upcoming Deadline Heads-Up Banner */}
      {upcomingDeadlines.length > 0 && (
        <section
          aria-label="Upcoming deadlines alert"
          className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950 animate-fade-in"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-bold block">
                Deadline Approaching: {upcomingDeadlines[0].scholarship.name}
              </span>
              <span className="text-amber-800">
                Deadline in {upcomingDeadlines[0].diffDays} days ({upcomingDeadlines[0].scholarship.deadlineDisplay}). Review the current instructions on {upcomingDeadlines[0].scholarship.applicationPlatformName} before applying.
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectScholarship(upcomingDeadlines[0].scholarship)}
            className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors self-start sm:self-auto"
          >
            Checklist &rarr;
          </button>
        </section>
      )}

      {/* Active Profile Overview Bar */}
      <section className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Active Profile:</span>
              <span className="text-xs font-semibold text-stone-900">
                {profile.educationStage || 'Education stage not set'} &bull; {profile.courseField || 'Any stream'}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              State: {profile.state || 'All India'} | Year: {profile.studyYear || 'Not set'} | Income: {profile.incomeRange || 'Not shared'}
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToProfile}
          className="self-start sm:self-auto text-xs font-semibold text-emerald-900 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition-colors border border-stone-200"
        >
          Adjust Profile &rarr;
        </button>
      </section>

      {/* Brief Summary Metric Cards strictly from real data */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        {/* Metric 1: Likely Matches */}
        <div
          onClick={onNavigateToDiscovery}
          className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:border-emerald-700/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Likely Matches
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-1">
              {likelyMatches.length}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Opportunities where your education stage, course stream, and state criteria appear satisfied.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-900 group-hover:text-emerald-700">
            <span>Explore all schemes ({scholarships.length})</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Metric 2: Saved Items */}
        <div
          onClick={onNavigateToSaved}
          className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:border-amber-600/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Saved Bookmarks
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-1">
              {savedCount}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Scholarships bookmarked for careful review and document preparation.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-900 group-hover:text-amber-700">
            <span>View saved items</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Metric 3: Application Tracker */}
        <div
          onClick={onNavigateToTracker}
          className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:border-sky-600/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Tracked Applications
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-1">
              {totalTracked}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Active schemes across Interested, Preparing, Started, and Submitted stages.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-sky-900 group-hover:text-sky-700">
            <span>Open application tracker</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </section>

      {/* Visual Application Stage Pipeline */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Personal Application Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Track your preparation milestones. Statuses are private notes stored only in this browser.
            </p>
          </div>
          <button
            onClick={onNavigateToTracker}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Open Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Stages Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-amber-200 space-y-1">
            <span className="font-bold text-amber-900 block">1. Interested</span>
            <span className="text-lg font-bold text-stone-900 block">{interestedCount}</span>
            <span className="text-[10px] text-stone-500 block">Evaluating eligibility</span>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-purple-200 space-y-1">
            <span className="font-bold text-purple-900 block">2. Preparing</span>
            <span className="text-lg font-bold text-stone-900 block">{preparingCount}</span>
            <span className="text-[10px] text-stone-500 block">Getting certificates</span>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-sky-200 space-y-1">
            <span className="font-bold text-sky-900 block">3. Started</span>
            <span className="text-lg font-bold text-stone-900 block">{startedCount}</span>
            <span className="text-[10px] text-stone-500 block">Form filling on portal</span>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-900 block">4. Submitted</span>
            <span className="text-lg font-bold text-stone-900 block">{submittedCount}</span>
            <span className="text-[10px] text-stone-500 block">Online packet sent</span>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-indigo-200 space-y-1 col-span-2 sm:col-span-1">
            <span className="font-bold text-indigo-900 block">5. Awaiting</span>
            <span className="text-lg font-bold text-stone-900 block">{awaitingCount}</span>
            <span className="text-[10px] text-stone-500 block">Pending merit result</span>
          </div>
        </div>

        {/* Quick view of tracked items */}
        {activeTrackedItems.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-3">
              Currently in your preparation pipeline:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeTrackedItems.map(({ scholarship, data }) => (
                <div
                  key={scholarship.id}
                  onClick={() => onSelectScholarship(scholarship)}
                  className="bg-white p-3.5 rounded-xl border border-stone-200 hover:border-emerald-600 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-stone-500 truncate max-w-[150px]">
                        {scholarship.provider}
                      </span>
                      <span className="px-1.5 py-0.2 rounded font-bold capitalize text-[10px] bg-emerald-100 text-emerald-800">
                        {data.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm line-clamp-1 mb-1">
                      {scholarship.name}
                    </h4>
                    <span className="text-xs font-bold text-emerald-800">
                      {scholarship.awardDisplay}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-900 flex items-center justify-between pt-2 mt-2 border-t border-stone-100 font-semibold">
                    <span>Open Checklist</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Top Recommendations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Recommended Schemes for You
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Evaluated strictly against your active profile education stage and course stream.
            </p>
          </div>
          <button
            onClick={onNavigateToDiscovery}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All ({scholarships.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topRecommendations.map(({ scholarship, match }) => (
            <div
              key={scholarship.id}
              onClick={() => onSelectScholarship(scholarship)}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-600/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-stone-500 truncate max-w-[170px]">
                    {scholarship.provider}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    match.category === 'likely'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : match.category === 'possible'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {match.category === 'likely' ? 'Likely Match' : match.category === 'possible' ? 'Check Details' : 'Mismatch'}
                  </span>
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 hover:text-emerald-900 transition-colors mb-2 leading-snug">
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

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                  {scholarship.summary}
                </p>

                <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-stone-200 text-xs text-stone-700">
                  <span className="font-semibold text-stone-900 block mb-0.5">{scholarship.applicationUrl && scholarship.applicationUrlVerified && scholarship.applicationStatus !== 'Closed' ? 'Apply through:' : 'Application destination:'}</span>
                  <span className="truncate block font-medium">{scholarship.applicationUrl && scholarship.applicationUrlVerified && scholarship.applicationStatus !== 'Closed' ? scholarship.applicationPlatformName : 'Not verified / unavailable for this cycle'}</span>
                  <span className="text-[10px] text-stone-500 block mt-1">Source: {scholarship.infoSourceLabel} · Checked {scholarship.lastCheckedDate}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">
                  {scholarship.preparationChecklist.length} preparation tasks
                </span>
                <span className="font-semibold text-emerald-800 flex items-center gap-0.5">
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
