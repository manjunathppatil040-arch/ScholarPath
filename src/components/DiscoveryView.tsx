import React, { useState, useMemo } from 'react';
import {
  Scholarship,
  StudentProfile,
  ScholarshipUserData,
  ApplicationStage,
  FilterState
} from '../types';
import { ScholarshipCard } from './ScholarshipCard';
import { calculateMatch } from '../utils/matching';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Compass,
  ArrowUpDown,
  X,
  Scale,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface DiscoveryViewProps {
  scholarships: Scholarship[];
  profile: StudentProfile;
  userData: Record<string, ScholarshipUserData>;
  compareIds: string[];
  onSelectScholarship: (scholarship: Scholarship) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onStatusChange: (id: string, status: ApplicationStage, e: React.MouseEvent) => void;
  onToggleCompare: (id: string, e: React.MouseEvent) => void;
  onOpenCompare: () => void;
  onClearCompare: () => void;
  onNavigateToProfile: () => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  scholarships,
  profile,
  userData,
  compareIds,
  onSelectScholarship,
  onToggleSave,
  onStatusChange,
  onToggleCompare,
  onOpenCompare,
  onClearCompare,
  onNavigateToProfile,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    educationStage: '',
    courseField: '',
    state: '',
    awardType: '',
    minAmountRupees: 0,
    deadlineFilter: 'all',
    onlyLikelyMatches: false,
    sortBy: 'best-match'
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Match evaluation for all items
  const scholarshipsWithMatch = useMemo(() => {
    return scholarships.map((item) => ({
      scholarship: item,
      match: calculateMatch(item, profile),
      user: userData[item.id] || {
        status: 'none' as ApplicationStage,
        isSaved: false,
        completedChecklist: [],
        notes: '',
        updatedAt: ''
      }
    }));
  }, [scholarships, profile, userData]);

  // Filter application
  const filteredScholarships = useMemo(() => {
    return scholarshipsWithMatch.filter(({ scholarship, match }) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = scholarship.name.toLowerCase().includes(q);
        const matchesProvider = scholarship.provider.toLowerCase().includes(q);
        const matchesSummary = scholarship.summary.toLowerCase().includes(q);
        const matchesTags = scholarship.tags.some(t => t.toLowerCase().includes(q));
        const matchesStreams = scholarship.courseFields.some(f => f.toLowerCase().includes(q));
        if (!matchesName && !matchesProvider && !matchesSummary && !matchesTags && !matchesStreams) {
          return false;
        }
      }

      // 2. Education Stage Filter
      if (filters.educationStage) {
        if (!scholarship.educationStages.includes(filters.educationStage as any)) {
          return false;
        }
      }

      // 3. Course Field Filter
      if (filters.courseField) {
        const isOpen = scholarship.courseFields.includes('General / Any Stream');
        const isMatch = scholarship.courseFields.includes(filters.courseField as any);
        if (!isOpen && !isMatch) return false;
      }

      // 4. State Filter
      if (filters.state) {
        const isPanIndia = scholarship.states.includes('All India / Pan-India');
        const isStateMatch = scholarship.states.includes(filters.state as any);
        if (!isPanIndia && !isStateMatch) return false;
      }

      // 5. Award Type Filter
      if (filters.awardType) {
        if (scholarship.awardType !== filters.awardType) return false;
      }

      // 6. Min Amount Filter
      if (filters.minAmountRupees > 0) {
        if (scholarship.awardAmountRupees < filters.minAmountRupees) return false;
      }

      // 7. Deadline Filter
      if (filters.deadlineFilter !== 'all') {
        if (!scholarship.deadline) return false;
        const deadlineDate = new Date(scholarship.deadline);
        const now = new Date();
        const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (filters.deadlineFilter === 'open_only' && scholarship.applicationStatus !== 'Applications Open') {
          return false;
        }
        if (filters.deadlineFilter === '30days' && (diffDays <= 0 || diffDays > 30)) {
          return false;
        }
        if (filters.deadlineFilter === '60days' && (diffDays <= 0 || diffDays > 60)) {
          return false;
        }
        if (filters.deadlineFilter === '90days' && (diffDays <= 0 || diffDays > 90)) {
          return false;
        }
      }

      // 8. Only Likely Matches Toggle
      if (filters.onlyLikelyMatches) {
        if (match.category !== 'likely') return false;
      }

      return true;
    });
  }, [scholarshipsWithMatch, filters]);

  // Sort application
  const sortedScholarships = useMemo(() => {
    return [...filteredScholarships].sort((a, b) => {
      if (filters.sortBy === 'best-match') {
        // Likely match (3) > Possible match (2) > Confirmed mismatch (1)
        const weightMap = { likely: 3, possible: 2, mismatch: 1 };
        const weightDiff = weightMap[b.match.category] - weightMap[a.match.category];
        if (weightDiff !== 0) return weightDiff;
        return b.scholarship.awardAmountRupees - a.scholarship.awardAmountRupees;
      }
      if (filters.sortBy === 'soonest-deadline') {
        const aDeadline = a.scholarship.deadline ? new Date(a.scholarship.deadline).getTime() : Number.POSITIVE_INFINITY;
        const bDeadline = b.scholarship.deadline ? new Date(b.scholarship.deadline).getTime() : Number.POSITIVE_INFINITY;
        return aDeadline - bDeadline;
      }
      if (filters.sortBy === 'award-high') {
        return b.scholarship.awardAmountRupees - a.scholarship.awardAmountRupees;
      }
      if (filters.sortBy === 'name') {
        return a.scholarship.name.localeCompare(b.scholarship.name);
      }
      return 0;
    });
  }, [filteredScholarships, filters.sortBy]);

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      educationStage: '',
      courseField: '',
      state: '',
      awardType: '',
      minAmountRupees: 0,
      deadlineFilter: 'all',
      onlyLikelyMatches: false,
      sortBy: 'best-match'
    });
  };

  const hasActiveFilters = Boolean(
    filters.searchQuery ||
    filters.educationStage ||
    filters.courseField ||
    filters.state ||
    filters.awardType ||
    filters.minAmountRupees > 0 ||
    filters.deadlineFilter !== 'all' ||
    filters.onlyLikelyMatches
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6 pb-24">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Scholarship Discovery Desk</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Find Scholarships in India
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-2xl">
            Explore India-focused opportunities with sources, checked dates, and profile-based guidance. Current profile: {profile.educationStage || 'stage not set'} · {profile.state || 'region not set'}.
          </p>
        </div>

        <button
          onClick={onNavigateToProfile}
          className="self-start md:self-auto flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-cream-200/70 hover:bg-cream-300 px-3.5 py-2 rounded-xl border border-stone-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Update Student Profile</span>
        </button>
      </div>

      {/* Mandatory Advisory Notice */}
      <div className="bg-[#FAF8F2] border border-amber-300/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Demo information only.</strong> Confirm current details with the official provider before applying.<br />
          <strong>Important:</strong> Scholarship information can change. Confirm eligibility, deadlines, and application instructions on the linked provider or application portal. A match does not guarantee an award.
        </div>
      </div>

      <section aria-label="Official scholarship sources" className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-semibold text-sm text-emerald-950">Check the latest opportunities</h2>
          <p className="text-xs text-emerald-900 mt-1 max-w-2xl">This curated demo catalog is reviewed manually; it does not update in the background. For a broader, current search, use the official portals directly.</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <a href="https://scholarships.gov.in/All-Scholarships" target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 px-3 py-2 text-xs font-semibold">Government portal ↗</a>
          <a href="https://scholarships.reliancefoundation.org/" target="_blank" rel="noreferrer" className="rounded-xl bg-white text-emerald-950 hover:bg-emerald-100 border border-emerald-300 px-3 py-2 text-xs font-semibold">Private foundation ↗</a>
        </div>
      </section>

      {/* Search and Filter Panel */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Search Bar & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scholarship title, provider, region, or study level..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm bg-stone-50/50"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-700 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <label htmlFor="sort-select" className="font-medium">Sort:</label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-transparent font-semibold text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="best-match">Best Profile Match</option>
                <option value="soonest-deadline">Soonest Deadline</option>
                <option value="award-high">Highest Award (₹)</option>
                <option value="name">Scheme Name (A - Z)</option>
              </select>
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-700 flex items-center justify-center"
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${showMobileFilters ? 'block' : 'hidden sm:grid'}`}>
          {/* Education Stage */}
          <div>
            <label htmlFor="filter-stage" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">Education Stage</label>
            <select
              id="filter-stage"
              value={filters.educationStage}
              onChange={(e) => setFilters({ ...filters, educationStage: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="">All Education Stages</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11–12">Class 11–12</option>
              <option value="Class 12 passed">Class 12 passed</option>
              <option value="Diploma/ITI">Diploma / ITI / Polytechnic</option>
              <option value="Undergraduate">Undergraduate (UG)</option>
              <option value="Postgraduate">Postgraduate (PG)</option>
            </select>
          </div>

          {/* Academic Field */}
          <div>
            <label htmlFor="filter-field" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">Course Stream</label>
            <select
              id="filter-field"
              value={filters.courseField}
              onChange={(e) => setFilters({ ...filters, courseField: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="">All Course Streams</option>
              <option value="Engineering & Technology">Engineering & Technology</option>
              <option value="Medical, Nursing & Allied Health">Medical, Nursing & Allied Health</option>
              <option value="Pure Sciences (B.Sc / M.Sc)">Pure Sciences</option>
              <option value="Commerce, Management & CA">Commerce & Management</option>
              <option value="Arts, Humanities & Social Sciences">Arts & Humanities</option>
              <option value="Law (LL.B / Integrated Law)">Law</option>
              <option value="Vocational & ITI Trades">Vocational & ITI</option>
            </select>
          </div>

          {/* Award Type */}
          <div>
            <label htmlFor="filter-awardType" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">Support Type</label>
            <select
              id="filter-awardType"
              value={filters.awardType}
              onChange={(e) => setFilters({ ...filters, awardType: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="">All Award Categories</option>
              <option value="Need-cum-Merit">Need-cum-Merit Support</option>
              <option value="Merit-based">Merit-based</option>
            </select>
          </div>

          {/* Deadline / Open Status */}
          <div>
            <label htmlFor="filter-deadline" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">Deadline / Status</label>
            <select
              id="filter-deadline"
              value={filters.deadlineFilter}
              onChange={(e) => setFilters({ ...filters, deadlineFilter: e.target.value as any })}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">Any Status & Deadline</option>
              <option value="open_only">Active / Open Applications Only</option>
              <option value="30days">Closing in next 30 days</option>
              <option value="60days">Closing in next 60 days</option>
              <option value="90days">Closing in next 90 days</option>
            </select>
          </div>
        </div>

        {/* Quick Toggles and Reset */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Only Likely Matches */}
            <button
              type="button"
              onClick={() => setFilters({ ...filters, onlyLikelyMatches: !filters.onlyLikelyMatches })}
              className={`px-3 py-1.5 rounded-full border font-semibold flex items-center gap-1.5 transition-colors ${
                filters.onlyLikelyMatches
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                  : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Likely Matches Only</span>
            </button>

          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1 underline underline-offset-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
        <span>
          Showing <strong>{sortedScholarships.length}</strong> of {scholarships.length} opportunities
        </span>
        {profile.educationStage && (
          <span className="hidden sm:inline text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
            Profile filter: {profile.educationStage} &bull; {profile.courseField || 'Any stream'} &bull; {profile.state || 'Pan-India'}
          </span>
        )}
      </div>

      {/* Cards Grid */}
      {sortedScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedScholarships.map(({ scholarship, user }) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              profile={profile}
              userData={user}
              isComparing={compareIds.includes(scholarship.id)}
              onSelect={onSelectScholarship}
              onToggleSave={onToggleSave}
              onStatusChange={onStatusChange}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 my-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
            <Filter className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              No scholarships matched your filters
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              We couldn't find any opportunities matching your specific stream or stage. Try broadening your education level, clearing the amount filter, or resetting all filters.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>
            <button
              onClick={onNavigateToProfile}
              className="px-5 py-2.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold hover:bg-stone-200 transition-colors"
            >
              Adjust Student Profile
            </button>
          </div>
        </div>
      )}

      {/* Floating Comparison Tray */}
      {compareIds.length > 0 && (
        <aside
          aria-label="Scholarship comparison tray"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-800 flex items-center gap-4 animate-fade-in max-w-xl w-[92vw]"
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Comparing <strong>{compareIds.length}</strong> of 3</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClearCompare}
              className="text-xs text-stone-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={onOpenCompare}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <span>Compare Side-by-Side</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

    </div>
  );
};
