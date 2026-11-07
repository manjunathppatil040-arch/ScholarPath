import React, { useState } from 'react';
import {
  StudentProfile,
  Scholarship,
  ScholarshipUserData,
  ApplicationStage
} from './types';
import { INDIAN_SCHOLARSHIPS } from './data/scholarships';
import {
  loadProfile,
  saveProfile,
  loadUserScholarshipData,
  saveUserScholarshipData,
  getOrCreateItemData,
  clearAllLocalData,
  EMPTY_PROFILE,
  DEMO_PROFILE
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { DiscoveryView } from './components/DiscoveryView';
import { TrackerView } from './components/TrackerView';
import { ProfileView } from './components/ProfileView';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal';
import { ComparisonModal } from './components/ComparisonModal';
import { Footer } from './components/Footer';
import { ChatBuddy } from './components/ChatBuddy';
import { Sparkles } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'discovery' | 'tracker' | 'saved' | 'profile'>('dashboard');
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);
  const [userData, setUserData] = useState<Record<string, ScholarshipUserData>>(loadUserScholarshipData);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync profile to localStorage
  const handleSaveProfile = (newProfile: StudentProfile) => {
    const savedProfile = { ...newProfile, isDemoProfile: false };
    setProfile(savedProfile);
    saveProfile(savedProfile);
    showToast('Profile updated! Match guidance recalculated.');
  };

  const handleTryDemo = () => {
    setProfile(DEMO_PROFILE);
    saveProfile(DEMO_PROFILE);
    setCurrentTab('discovery');
    showToast('Fictional demo profile loaded. Edit or clear it in Profile.');
  };

  // Sync user data to localStorage
  const updateUserData = (updater: (prev: Record<string, ScholarshipUserData>) => Record<string, ScholarshipUserData>) => {
    setUserData((prev) => {
      const next = updater(prev);
      saveUserScholarshipData(next);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Clear all data
  const handleClearAllData = () => {
    clearAllLocalData();
    setProfile(EMPTY_PROFILE);
    setUserData({});
    setCompareIds([]);
    setSelectedScholarship(null);
    showToast('All browser-stored data and tracker notes cleared.');
  };

  // Toggle bookmark / saved
  const handleToggleSave = (scholarshipId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateUserData((prev) => {
      const current = getOrCreateItemData(prev, scholarshipId);
      const isSaved = !current.isSaved;
      showToast(isSaved ? 'Saved to bookmarks' : 'Removed from bookmarks');
      return {
        ...prev,
        [scholarshipId]: {
          ...current,
          isSaved,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  // Change personal application stage
  const handleStatusChange = (scholarshipId: string, status: ApplicationStage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateUserData((prev) => {
      const current = getOrCreateItemData(prev, scholarshipId);
      const statusLabels: Record<ApplicationStage, string> = {
        none: 'Removed from active tracker',
        interested: 'Stage updated: Interested',
        preparing: 'Stage updated: Preparing Documents',
        started: 'Stage updated: Started on Portal',
        submitted: 'Stage updated: Submitted! 🎉',
        awaiting_result: 'Stage updated: Awaiting Result ⏳'
      };
      showToast(statusLabels[status]);
      return {
        ...prev,
        [scholarshipId]: {
          ...current,
          status,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  // Toggle checklist item
  const handleToggleChecklistItem = (scholarshipId: string, item: string) => {
    updateUserData((prev) => {
      const current = getOrCreateItemData(prev, scholarshipId);
      const exists = current.completedChecklist.includes(item);
      const updatedList = exists
        ? current.completedChecklist.filter(i => i !== item)
        : [...current.completedChecklist, item];

      // Auto-move to 'preparing' if not already tracked and student begins checking documents
      const nextStatus = current.status === 'none' ? 'preparing' : current.status;

      return {
        ...prev,
        [scholarshipId]: {
          ...current,
          completedChecklist: updatedList,
          status: nextStatus,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  // Add custom checklist item
  const handleAddCustomChecklistItem = (scholarshipId: string, item: string) => {
    updateUserData((prev) => {
      const current = getOrCreateItemData(prev, scholarshipId);
      const existingCustom = current.customTasks || [];
      showToast(`Custom task added: ${item}`);
      return {
        ...prev,
        [scholarshipId]: {
          ...current,
          customTasks: [...existingCustom, item],
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  // Remove custom checklist item
  const handleRemoveCustomChecklistItem = (scholarshipId: string, item: string) => {
    updateUserData((prev) => {
      const current = getOrCreateItemData(prev, scholarshipId);
      const existingCustom = current.customTasks || [];
      return {
        ...prev,
        [scholarshipId]: {
          ...current,
          customTasks: existingCustom.filter(i => i !== item),
          completedChecklist: current.completedChecklist.filter(i => i !== item),
          updatedAt: new Date().toISOString()
        }
      };
    });
    showToast('Custom task removed');
  };

  // Save student private notes
  const handleSaveNotes = (scholarshipId: string, notes: string) => {
    updateUserData((prev) => {
      const current = getOrCreateItemData(prev, scholarshipId);
      return {
        ...prev,
        [scholarshipId]: {
          ...current,
          notes,
          updatedAt: new Date().toISOString()
        }
      };
    });
    showToast('Personal notes saved');
  };

  // Compare toggles
  const handleToggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(item => item !== id));
      showToast('Removed from comparison list');
    } else {
      if (compareIds.length >= 3) {
        showToast('You can compare up to 3 opportunities at a time');
        return;
      }
      setCompareIds([...compareIds, id]);
      showToast('Added to comparison list');
    }
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareIds(compareIds.filter(item => item !== id));
  };

  const handleClearCompare = () => {
    setCompareIds([]);
  };

  const savedCount = Object.values(userData).filter(d => d.isSaved).length;
  const trackedCount = Object.values(userData).filter(d => d.status !== 'none').length;

  const compareScholarships = INDIAN_SCHOLARSHIPS.filter(s => compareIds.includes(s.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-stone-900">

      {/* Toast Notification Banner */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-cream-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-stone-700 animate-fade-in"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Main Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedCount}
        trackedCount={trackedCount}
        profile={profile}
      />

      {/* View Switcher */}
      <main className="flex-1">
        {currentTab === 'dashboard' && (
          <Dashboard
            scholarships={INDIAN_SCHOLARSHIPS}
            profile={profile}
            userData={userData}
            onNavigateToDiscovery={() => setCurrentTab('discovery')}
            onNavigateToTracker={() => setCurrentTab('tracker')}
            onNavigateToSaved={() => setCurrentTab('saved')}
            onNavigateToProfile={() => setCurrentTab('profile')}
            onTryDemo={handleTryDemo}
            onSelectScholarship={(s) => setSelectedScholarship(s)}
            onToggleSave={handleToggleSave}
            onStatusChange={handleStatusChange}
          />
        )}

        {currentTab === 'discovery' && (
          <DiscoveryView
            scholarships={INDIAN_SCHOLARSHIPS}
            profile={profile}
            userData={userData}
            compareIds={compareIds}
            onSelectScholarship={(s) => setSelectedScholarship(s)}
            onToggleSave={handleToggleSave}
            onStatusChange={handleStatusChange}
            onToggleCompare={handleToggleCompare}
            onOpenCompare={() => setIsCompareModalOpen(true)}
            onClearCompare={handleClearCompare}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        )}

        {currentTab === 'saved' && (
          <TrackerView
            scholarships={INDIAN_SCHOLARSHIPS}
            profile={profile}
            userData={userData}
            initialTab="saved"
            onSelectScholarship={(s) => setSelectedScholarship(s)}
            onToggleSave={handleToggleSave}
            onStatusChange={handleStatusChange}
            onNavigateToDiscovery={() => setCurrentTab('discovery')}
          />
        )}

        {currentTab === 'tracker' && (
          <TrackerView
            scholarships={INDIAN_SCHOLARSHIPS}
            profile={profile}
            userData={userData}
            initialTab="tracker"
            onSelectScholarship={(s) => setSelectedScholarship(s)}
            onToggleSave={handleToggleSave}
            onStatusChange={handleStatusChange}
            onNavigateToDiscovery={() => setCurrentTab('discovery')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onClearAllData={handleClearAllData}
            onNavigateToDiscovery={() => setCurrentTab('discovery')}
          />
        )}
      </main>

      {/* Detail Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          profile={profile}
          userData={getOrCreateItemData(userData, selectedScholarship.id)}
          isOpen={Boolean(selectedScholarship)}
          onClose={() => setSelectedScholarship(null)}
          onToggleSave={handleToggleSave}
          onStatusChange={handleStatusChange}
          onToggleChecklistItem={handleToggleChecklistItem}
          onAddCustomChecklistItem={handleAddCustomChecklistItem}
          onRemoveCustomChecklistItem={handleRemoveCustomChecklistItem}
          onSaveNotes={handleSaveNotes}
        />
      )}

      {/* Comparison Modal */}
      {isCompareModalOpen && (
        <ComparisonModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          scholarships={compareScholarships}
          profile={profile}
          userData={userData}
          onRemoveFromCompare={handleRemoveFromCompare}
          onSelectScholarship={(s) => {
            setIsCompareModalOpen(false);
            setSelectedScholarship(s);
          }}
          onToggleSave={handleToggleSave}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={(tab) => {
        setCurrentTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      <ChatBuddy
        scholarships={INDIAN_SCHOLARSHIPS}
        profile={profile}
        onOpenProfile={() => setCurrentTab('profile')}
      />

    </div>
  );
}

export default App;
