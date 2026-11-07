import React from 'react';
import { GraduationCap, Compass, Bookmark, CheckSquare, User, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'discovery' | 'tracker' | 'saved' | 'profile';
  setCurrentTab: (tab: 'dashboard' | 'discovery' | 'tracker' | 'saved' | 'profile') => void;
  savedCount: number;
  trackedCount: number;
  profile: StudentProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  savedCount,
  trackedCount,
  profile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Advisory Banner */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>
          <strong>Student Guidance Notice:</strong> Scholarship information can change. Confirm eligibility, deadlines, and application instructions on the linked provider or application portal. A match does not guarantee an award.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-emerald-100 shadow-md group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                  ScholarPath
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                  India
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Honest, profile-matched Indian scholarship discovery
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links: Home, Find Scholarships, Saved, Tracker, Profile */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setCurrentTab('discovery')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'discovery'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Find Scholarships</span>
            </button>

            <button
              onClick={() => setCurrentTab('saved')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                currentTab === 'saved'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                  currentTab === 'saved'
                    ? 'bg-emerald-950 text-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('tracker')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                currentTab === 'tracker'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Tracker</span>
              {trackedCount > 0 && (
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                  currentTab === 'tracker'
                    ? 'bg-emerald-950 text-emerald-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {trackedCount}
                </span>
              )}
            </button>

            <div className="h-5 w-[1px] bg-stone-300 mx-1" />

            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'profile'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold border border-emerald-300">
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="truncate max-w-[110px]">
                {profile.fullName ? profile.fullName.split(' ')[0] : 'Profile'}
              </span>
            </button>
          </nav>

          {/* Mobile Profile Action */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setCurrentTab('profile')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200"
            >
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>{profile.fullName ? profile.fullName.split(' ')[0] : 'Profile'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-200/80 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded-md ${
              currentTab === 'dashboard' ? 'text-emerald-800 font-bold' : 'text-stone-600'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setCurrentTab('discovery')}
            className={`flex flex-col items-center py-1 px-2 rounded-md ${
              currentTab === 'discovery' ? 'text-emerald-800 font-bold' : 'text-stone-600'
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span>Discover</span>
          </button>
          <button
            onClick={() => setCurrentTab('saved')}
            className={`flex flex-col items-center py-1 px-2 rounded-md relative ${
              currentTab === 'saved' ? 'text-emerald-800 font-bold' : 'text-stone-600'
            }`}
          >
            <Bookmark className="w-4 h-4 mb-0.5" />
            <span>Saved ({savedCount})</span>
          </button>
          <button
            onClick={() => setCurrentTab('tracker')}
            className={`flex flex-col items-center py-1 px-2 rounded-md relative ${
              currentTab === 'tracker' ? 'text-emerald-800 font-bold' : 'text-stone-600'
            }`}
          >
            <CheckSquare className="w-4 h-4 mb-0.5" />
            <span>Tracker ({trackedCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
