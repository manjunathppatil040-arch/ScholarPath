import { Scholarship, StudentProfile, MatchResult } from '../types';

const guidanceNotice = 'This is guidance based on the listed criteria, not an official eligibility decision. A match does not guarantee an award.';

export function calculateMatch(scholarship: Scholarship, profile: StudentProfile): MatchResult {
  const reasons: string[] = [];
  const missingOrUnknown: string[] = [];
  const mismatchReasons: string[] = [];

  if (scholarship.isDemoRecord) missingOrUnknown.push('This is a fictional demo example, not a real opportunity.');

  if (!profile.educationStage) missingOrUnknown.push('Add your education stage to check this requirement.');
  else if (scholarship.educationStages.length && !scholarship.educationStages.includes(profile.educationStage)) {
    mismatchReasons.push(`Your education stage (${profile.educationStage}) is outside the listed stages: ${scholarship.educationStages.join(', ')}.`);
  } else if (scholarship.educationStages.length) reasons.push(`Your ${profile.educationStage} stage is listed for this opportunity.`);
  else missingOrUnknown.push('Eligible education stages are not verified.');

  if (scholarship.states.includes('All India / Pan-India')) reasons.push('This is a national scheme; the listed criteria do not restrict it by state.');
  else if (!profile.state) missingOrUnknown.push('Add your state or region to check domicile requirements.');
  else if (scholarship.states.length && !scholarship.states.includes(profile.state)) mismatchReasons.push(`Your state (${profile.state}) is not in the listed regions.`);
  else if (scholarship.states.length) reasons.push(`Your state (${profile.state}) is included in the listed regions.`);
  else missingOrUnknown.push('Eligible regions are not verified.');

  if (scholarship.courseFields.includes('General / Any Stream')) {
    reasons.push(profile.courseField ? `Open to all streams, including ${profile.courseField}.` : 'No course-stream restriction is listed.');
  } else if (!profile.courseField) missingOrUnknown.push('Add your course field to check this requirement.');
  else if (scholarship.courseFields.length && !scholarship.courseFields.includes(profile.courseField)) mismatchReasons.push(`Your course field (${profile.courseField}) is outside the listed fields: ${scholarship.courseFields.join(', ')}.`);
  else if (scholarship.courseFields.length) reasons.push(`Your course field (${profile.courseField}) is listed.`);

  if (scholarship.maxAnnualIncomeRupees) {
    if (!profile.incomeRange || profile.incomeRange === 'Prefer not to say') missingOrUnknown.push(`Income is relevant (ceiling: ₹${scholarship.maxAnnualIncomeRupees.toLocaleString('en-IN')} per year); you can leave it private and check directly with the provider.`);
    else {
      const ranges: Record<string, [number, number]> = {
        'Below ₹1,50,000': [0, 150000], '₹1,50,000 - ₹2,50,000': [150000, 250000],
        '₹2,50,000 - ₹4,00,000': [250000, 400000], '₹4,00,000 - ₹6,00,000': [400000, 600000],
        '₹6,00,000 - ₹8,00,000': [600000, 800000], 'Above ₹8,00,000': [800000, Infinity]
      };
      const range = ranges[profile.incomeRange];
      if (range?.[0] >= scholarship.maxAnnualIncomeRupees) mismatchReasons.push(`Your selected income range is above the listed ceiling of ₹${scholarship.maxAnnualIncomeRupees.toLocaleString('en-IN')} per year.`);
      else if (range && (scholarship.incomeLimitType === 'less-than'
        ? range[1] < scholarship.maxAnnualIncomeRupees
        : range[1] <= scholarship.maxAnnualIncomeRupees)) reasons.push('Your selected income range is within the listed ceiling.');
      else missingOrUnknown.push('Your income range overlaps the listed ceiling; confirm the exact value with the provider.');
    }
  }

  if (scholarship.genderRestriction === 'female_only') {
    if (!profile.gender) missingOrUnknown.push('A gender-specific criterion is listed; leave this blank and check directly if preferred.');
    else if (profile.gender === 'Female / Girl Student') reasons.push('Your profile matches the listed gender criterion.');
    else mismatchReasons.push('Does not meet a listed gender requirement.');
  }

  if (scholarship.studyYearRestriction?.length) {
    if (!profile.studyYear) missingOrUnknown.push('Add your current year of study to check the listed restriction.');
    else if (!scholarship.studyYearRestriction.includes(profile.studyYear)) mismatchReasons.push(`Your year of study is outside the listed years: ${scholarship.studyYearRestriction.join(', ')}.`);
    else reasons.push(`Your ${profile.studyYear} status matches a listed year.`);
  }

  // Community eligibility is a sensitive optional profile field. Only ask for it when the
  // scholarship's documented criteria require it; unknown details stay unknown.
  if (scholarship.id.startsWith('pm-yasasvi')) {
    if (!profile.socialCategory) missingOrUnknown.push('Community category is an eligibility criterion. Add it only if you choose, or confirm it with the official portal.');
    else if (['OBC', 'EBC', 'DNT'].includes(profile.socialCategory)) reasons.push('Your selected category is listed in the scheme criteria.');
    else mismatchReasons.push('Does not meet a listed community category requirement.');
  }
  if (scholarship.id.startsWith('top-class-sc')) {
    if (!profile.socialCategory) missingOrUnknown.push('Community category is an eligibility criterion. Add it only if you choose, or confirm it with the official portal.');
    else if (profile.socialCategory === 'SC') reasons.push('Your selected category is listed in the scheme criteria.');
    else mismatchReasons.push('Does not meet a listed community category requirement.');
  }

  // Source does not confirm current-cycle document, school/institution or other requirements.
  if (!scholarship.confirmedDocuments.length) missingOrUnknown.push('Current-cycle document requirements are not verified.');
  if (scholarship.id.includes('top-class')) missingOrUnknown.push('Confirm that your school or institution is on the current notified list; it is not part of this profile.');
  if (scholarship.applicationStatus === 'Unknown') missingOrUnknown.push('Current application status is not verified.');

  const category = mismatchReasons.length ? 'mismatch' : missingOrUnknown.length ? 'possible' : 'likely';
  const headline = category === 'mismatch' ? 'Does not meet a listed requirement' : category === 'possible' ? 'Needs checking' : 'Likely match';
  return { category, headline, reasons, missingOrUnknown, mismatchReasons, guidanceNotice };
}
