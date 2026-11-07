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

The small catalog lives in [`src/data/scholarships.ts`](src/data/scholarships.ts). Current entries link to the National Scholarship Portal and Ministry of Social Justice and Empowerment information. Application status and criteria can change, so confirm them at the linked official source before applying. A match is guidance only and does not guarantee an award.

Some current-cycle details are deliberately marked “Not verified” where the available official source only confirms an earlier cycle. An Apply button is shown only for a verified application destination.
