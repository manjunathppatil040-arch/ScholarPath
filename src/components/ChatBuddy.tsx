import React, { FormEvent, useMemo, useState } from 'react';
import { MessageCircle, Send, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { Scholarship, StudentProfile } from '../types';
import { calculateMatch } from '../utils/matching';

type Message = { id: number; from: 'guide' | 'student'; text: string };

const OFFICIAL_LINKS = [
  { label: 'Government scholarships (NSP)', href: 'https://scholarships.gov.in/All-Scholarships' },
  { label: 'Reliance Foundation scholarships', href: 'https://scholarships.reliancefoundation.org/' },
  { label: 'Ministry of Education scholarships', href: 'https://www.education.gov.in/scholarship-schemes' }
];

function answerQuestion(question: string, scholarships: Scholarship[], profile: StudentProfile): string {
  const query = question.toLowerCase();

  if (/deadline|closing|due date|when.*close/.test(query)) {
    const upcoming = scholarships
      .filter(item => item.applicationStatus === 'Applications Open' && item.deadline)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 3);
    if (!upcoming.length) return 'I do not have a verified upcoming deadline in this small demo catalog. Check the official portals below for the current complete list.';
    return `Open opportunities with the nearest catalog deadlines: ${upcoming.map(item => `${item.name} — ${item.deadlineDisplay}`).join('; ')}. Confirm each date with its official source before applying.`;
  }

  if (/private|company|foundation|corporate/.test(query)) {
    const privateItems = scholarships.filter(item => item.providerType !== 'Government (Central/State)');
    const summary = privateItems.length
      ? privateItems.map(item => `${item.name} (${item.applicationStatus === 'Closed' ? 'currently listed as closed' : item.applicationStatus.toLowerCase()})`).join('; ')
      : 'No private-provider record is in the current demo catalog.';
    return `${summary}. The catalog is not exhaustive. Use the provider’s own page for their full and latest listings.`;
  }

  if (/government|govt|state scheme|central/.test(query)) {
    const openItems = scholarships.filter(item => item.providerType === 'Government (Central/State)' && item.applicationStatus === 'Applications Open');
    const summary = openItems.length
      ? openItems.map(item => `${item.name}${item.deadlineDisplay ? ` — ${item.deadlineDisplay}` : ''}`).join('; ')
      : 'No government entry in this demo catalog is currently marked open.';
    return `${summary}. This is a short curated sample, not every central or state scheme. Check NSP and your state’s scholarship portal for the full list.`;
  }

  if (/match|eligible|fit|recommend|for me/.test(query)) {
    if (!profile.educationStage) return 'Add your education stage, field and state in Profile first. I can then explain matches using the criteria in this catalog. You can leave sensitive optional fields blank.';
    const matches = scholarships
      .map(item => ({ item, result: calculateMatch(item, profile) }))
      .filter(entry => entry.item.applicationStatus !== 'Closed' && entry.result.category !== 'mismatch')
      .sort((a, b) => (a.result.category === 'likely' ? 0 : 1) - (b.result.category === 'likely' ? 0 : 1))
      .slice(0, 3);
    if (!matches.length) return 'I could not find an open catalog item that fits the details currently set. That does not mean you cannot qualify for other schemes; search the official portals below.';
    return `Based on the profile in this browser, start by checking: ${matches.map(({ item, result }) => `${item.name} (${result.headline})`).join('; ')}. “Likely” and “Needs checking” are guidance, not an official eligibility decision.`;
  }

  if (/saved|bookmark|tracker|track|status/.test(query)) {
    return 'Open a scholarship card to save it, update its application stage, and keep a preparation checklist. Saved items and progress stay in this browser; ScholarPath does not submit applications.';
  }

  if (/document|paperwork|certificate/.test(query)) {
    return 'Required documents vary by scheme and cycle. Open an opportunity’s details and follow its official source. When current documents are unverified, ScholarPath says so instead of guessing.';
  }

  return 'I can help with profile-based matches, upcoming catalog deadlines, government vs private listings, and saving/tracking. I use only this app’s small catalog—not a live chatbot or daily data feed. Check official sources for the full current list.';
}

export const ChatBuddy: React.FC<{
  scholarships: Scholarship[];
  profile: StudentProfile;
  onOpenProfile: () => void;
}> = ({ scholarships, profile, onOpenProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'guide', text: 'Hi! Ask me to find matches, check a catalog deadline, or find official portals.' }
  ]);
  const nextId = useMemo(() => Math.max(...messages.map(message => message.id), 0) + 1, [messages]);

  const sendMessage = (question: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    const reply = answerQuestion(cleanQuestion, scholarships, profile);
    setMessages(current => [
      ...current,
      { id: nextId, from: 'student', text: cleanQuestion },
      { id: nextId + 1, from: 'guide', text: reply }
    ]);
    setDraft('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <section aria-label="ScholarPath guide chat" className="w-[min(22rem,calc(100vw-2rem))] h-[min(34rem,calc(100dvh-7rem))] bg-white border border-stone-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-fade-in">
          <header className="bg-emerald-950 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center"><Sparkles className="w-4 h-4 text-emerald-200" /></div>
              <div><h2 className="font-semibold text-sm">ScholarPath Guide</h2><p className="text-[10px] text-emerald-200">Catalog-based help · no live AI</p></div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat" className="p-2 rounded-lg hover:bg-white/10 focus-visible:outline focus-visible:outline-2"><X className="w-4 h-4" /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-3 space-y-3" aria-live="polite" aria-label="Chat messages">
            {messages.map(message => (
              <div key={message.id} className={`max-w-[92%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${message.from === 'student' ? 'ml-auto bg-emerald-800 text-white rounded-br-md' : 'mr-auto bg-stone-100 text-stone-800 rounded-bl-md'}`}>
                {message.text}
              </div>
            ))}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 space-y-2">
              <p className="text-[10px] text-emerald-950 font-semibold">Official sources</p>
              <div className="flex flex-wrap gap-1.5">
                {OFFICIAL_LINKS.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white border border-emerald-200 px-2 py-1 text-[10px] font-medium text-emerald-900 hover:bg-emerald-100">{link.label}<ArrowUpRight className="w-3 h-3" /></a>)}
              </div>
              <button type="button" onClick={onOpenProfile} className="text-[10px] text-emerald-900 underline underline-offset-2">Update profile for match guidance</button>
            </div>
          </div>

          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto">
            {['Find my matches', 'What closes soon?', 'Private scholarships'].map(prompt => (
              <button key={prompt} type="button" onClick={() => sendMessage(prompt)} className="shrink-0 rounded-full border border-stone-300 px-2.5 py-1 text-[10px] text-stone-700 hover:border-emerald-700 hover:text-emerald-900">{prompt}</button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-3 border-t border-stone-200 flex gap-2">
            <label htmlFor="scholarpath-chat-input" className="sr-only">Ask ScholarPath Guide</label>
            <input id="scholarpath-chat-input" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask about scholarships…" className="min-w-0 flex-1 rounded-xl border border-stone-300 px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-emerald-700" />
            <button type="submit" aria-label="Send message" disabled={!draft.trim()} className="rounded-xl px-3 bg-emerald-800 text-white disabled:opacity-40 hover:bg-emerald-900"><Send className="w-4 h-4" /></button>
          </form>
        </section>
      )}
      <button type="button" onClick={() => setIsOpen(open => !open)} aria-expanded={isOpen} aria-label={isOpen ? 'Close scholarship guide chat' : 'Open scholarship guide chat'} className="rounded-full bg-emerald-800 hover:bg-emerald-900 text-white shadow-xl px-4 py-3 flex items-center gap-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-950">
        {isOpen ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
        <span>{isOpen ? 'Close guide' : 'Ask ScholarPath'}</span>
      </button>
    </div>
  );
};
