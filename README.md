# ScholarPath

ScholarPath is a browser-only scholarship discovery and application-tracking demo for students in India. It uses React, Vite, TypeScript, Tailwind CSS, and Lucide icons.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To create a production build, run `npm run build`; to preview that build, run `npm run preview`.

## Student journey

- Create or edit a student profile; matching fields and optional income/community category stay in the browser's local storage.
- Search and filter opportunities by education stage, course stream, support type, and closing date.
- Review profile-based match guidance, requirements, sources, checked dates, and application destinations.
- Save opportunities and track personal application stages and preparation reminders.
- Clear the profile and tracking data from the Profile view.

ScholarPath does not submit applications. Statuses, checklists, and any personal notes are not sent to or synced with scholarship providers.

## Scholarship data

The curated catalog lives in [`src/data/scholarships.ts`](src/data/scholarships.ts). Entries link to official government or provider pages and include a last-checked date. This is a static demo: it does not fetch updates or cover every central, state, or private scholarship each day. Use the official links in Discovery for the complete, current listings. Confirm eligibility, dates, award amounts, documents, and instructions with the provider before applying.

Some details are deliberately marked “Not verified” where a current official source does not confirm them. An Apply button is shown only for a verified application destination. The in-app ScholarPath Guide is a small deterministic helper using the local catalog and browser profile; it is not an AI service, and it does not submit applications.
