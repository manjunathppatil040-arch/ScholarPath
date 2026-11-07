import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'dashboard' | 'discovery' | 'tracker' | 'saved' | 'profile') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-cream-100">
                ScholarPath India
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Helping Indian students answer four key financial aid questions quickly: fit, document preparation, deadlines, and verified application portals.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Client-side: Stored solely in your browser. No Aadhaar or phone required.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100">Navigation</h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('discovery')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Find Scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('saved')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Saved Schemes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracker')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Application Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Student Profile & Match Criteria
                </button>
              </li>
            </ul>
          </div>

          {/* Transparency & Honesty */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100">Honesty & Disclaimer</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              <strong>Scholarship information can change.</strong> Confirm eligibility, deadlines, and application instructions on the linked provider or application portal. A match does not guarantee an award.
            </p>
            <p className="text-[11px] text-stone-500">
              ScholarPath does not submit applications. External links are labeled by the site they open; an unverified application destination has no Apply button.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <span>&copy; {new Date().getFullYear()} ScholarPath India. Built for THE OUTPOST Hackathon.</span>
          <span className="flex items-center gap-1">
            Student-first guidance for Indian education.
          </span>
        </div>
      </div>
    </footer>
  );
};
