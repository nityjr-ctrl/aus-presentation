// Content for the redesigned AUS teaching deck: acts, study glossary and the spoken script.
// On-slide wording comes from ../slides.json (unchanged). Evidence statements follow
// presenter-guide/AUS-ST5-presenter-guide.md and EVIDENCE-AUDIT-2026-10-05.md; nothing new is claimed.

export const PRESENTERS = [
  ['Mr Andrew Baird', 'Urology Consultant'],
  ['Mr Abu Yousif', 'Urology Consultant'],
  ['Nity G', 'ST5 Urology Registrar'],
];

// Six acts over the 60-minute clock. `slides` are teaching-slide numbers 1–38.
export const ACTS = [
  { numeral: 'I', title: 'Decide before theatre', question: 'Can this patient obtain useful continence while storing and emptying safely and operating the device?', slides: [1, 9], clock: '00:00 – 14:00', minutes: 14 },
  { numeral: 'II', title: 'The bladder', question: 'Separate overactivity, weak contraction and poor compliance, because each leads to a different decision.', slides: [10, 14], clock: '14:00 – 22:00', minutes: 8 },
  { numeral: 'III', title: 'The urethra', question: 'Name the narrowing, prove the outlet is stable, and plan the tissue the cuff will need.', slides: [15, 19], clock: '22:00 – 29:00', minutes: 7 },
  { numeral: 'IV', title: 'Preparation without ritual', question: 'Identify the activity, the product and the evidence before debating a duration.', slides: [20, 24], clock: '29:00 – 36:00', minutes: 7 },
  { numeral: 'V', title: 'The operation', question: 'Preserve tissue, measure what the cuff will enclose, follow the actual device protocol, and verify before closing.', slides: [25, 32], clock: '36:00 – 50:00', minutes: 14 },
  { numeral: 'VI', title: 'After the implant', question: 'Hand over the risk, diagnose late leakage before revising, and say where the evidence stops.', slides: [33, 38], clock: '50:00 – 60:00', minutes: 10 },
];

export function actOf(n) {
  return ACTS.find((a) => n >= a.slides[0] && n <= a.slides[1]);
}

// What each cited source is and what it says. Written for the spoken "Studies on this slide" block.
export const GLOSSARY = {
  BAUS25: { name: 'BAUS consensus 2025 (Bhatt et al., BJU Int)', kind: 'UK expert consensus after literature review and modified Delphi', says: 'Sets the UK assessment and perioperative pathway: VUDS for surgical candidates, severity-dependent recovery periods, treatment of narrowing before continence surgery, and a five-minute topical field scrub that it labels as Delphi extrapolation. Consensus supports a consistent pathway; it does not prove each interval or step is uniquely optimal.' },
  EAU26: { name: 'EAU non-neurogenic male LUTS guideline 2026', kind: 'European guideline', says: 'Recommends structured symptom assessment, diary, pad-weight and residual measures; weakly recommends invasive urodynamics before invasive treatment while acknowledging limited outcome evidence. A weak recommendation signals uncertainty, not a valueless test.' },
  AUA24: { name: 'AUA/GURS/SUFU incontinence after prostate treatment, amended 2024', kind: 'US guideline', says: 'Permits surgery from six months for bothersome non-improving SUI and recommends offering it at one year; cystourethroscopy before SUI surgery is expert opinion; urodynamics is conditional (Grade C) when it helps diagnosis or counselling. It also supports pump suitability, lifetime counselling and interval cystoscopy at least four to six weeks after treating BNC or VUAS.' },
  EAUSTR26: { name: 'EAU urethral strictures guideline 2026', kind: 'European guideline', says: 'Distinguishes anterior strictures from posterior stenosis and gives reconstruction-specific pathways, including deferring continence surgery for three to six months after redo vesicourethral anastomosis. That interval belongs to that setting, not to every dilation or urethroplasty.' },
  ICS16: { name: 'ICS AUS consensus 2015, published 2016 (Biardeau et al.)', kind: 'International consensus, centred on AMS 800', says: 'Covers assessment, operative principles, complications and aftercare: adequate dexterity and cognition, bladder and outlet evaluation, and device-aware instrumentation. Its technical and catheter advice is AMS-era and context-specific, not a universal ContiClassic rule.' },
  AP23: { name: 'Asia-Pacific AMS 800 consensus 2023 (Chung et al.)', kind: 'Regional expert consensus', says: 'Practical consensus on selection, investigation, troubleshooting and aftercare, including common AMS 800 pressure selection (61–70 cmH2O) and preparation. Its fill volumes and preparation sequence belong to AMS 800, not automatically to ContiClassic.' },
  CCIFU: { name: 'Rigicon ContiClassic instructions for use, REV.03, 2023', kind: 'Manufacturer labelling', says: 'Requires associated urge, overflow or instability to be treated and controlled or resolved, contraindicates irresolvable instability, warns about poor compliance and thin spongiosum, requires cuff deflation and deactivation before instrumentation, specifies four to six weeks deactivated, and describes a longer postoperative antibiotic regimen than stewardship sources. These are product instructions, not proof of efficacy. Country and lot applicability and the separate OR protocol remain unverified.' },
  ICSUDS17: { name: 'ICS good urodynamic practices 2017 (Rosier et al.)', kind: 'Testing standard', says: 'Sets quality standards for uroflowmetry, cystometry and pressure-flow testing. It tells us to confirm a trace is credible and representative before labelling DO, DU, compliance or obstruction. It sets no AUS eligibility threshold.' },
  AUAOAB24: { name: 'AUA/SUFU idiopathic OAB guideline 2024 (Cameron et al.)', kind: 'US guideline', says: 'Evidence-based behavioural, drug and procedural options for OAB with shared decision-making, including the retention implications of botulinum toxin. It does not establish an optimal sequence around AUS implantation.' },
  NICE: { name: 'NICE NG125: surgical site infection', kind: 'UK national guidance', says: 'Soap washing before surgery, appropriate antiseptic skin preparation with drying, clipping rather than shaving if hair removal is needed, and no wound irrigation solely to reduce SSI. It tests no fifteen-minute AUS preparation.' },
  WHO09: { name: 'WHO hand hygiene guidance 2009', kind: 'International standard', says: 'Covers surgical hand antisepsis. Its relevance is the distinction between preparing the team\'s hands and preparing the patient\'s skin. It sets no patient-field scrub duration.' },
  CHLORA26: { name: 'ChloraPrep Swabstick UK product information, 2026', kind: 'Product information (SmPC)', says: 'Permitted sites, allergy, intact-skin-only use, a 30-second application with complete air drying and flammability warnings for that presentation. It shows why the actual formulation matters; it is not a universal genital preparation prescription.' },
  IDSA19: { name: 'IDSA asymptomatic bacteriuria guideline 2019 (Nicolle et al.)', kind: 'US infectious-disease guideline', says: 'Suggests against screening for or treating asymptomatic bacteriuria solely for AUS or penile prosthesis implantation, with standard prophylaxis retained. The recommendation is weak, on very-low-quality evidence, and differs from the BAUS urine pathway.' },
  AUAABX20: { name: 'AUA antimicrobial prophylaxis statement 2020 (Lightner et al.)', kind: 'Consensus statement informed by literature review', says: 'Correct timing, redosing and the shortest necessary duration; single-dose prophylaxis for most urological procedures and no unnecessary continuation. It does not settle every high-risk implant or override product precautions.' },
  CCSAFETY: { name: 'Wilson et al.: first ContiClassic safety outcomes, IJIR 2024', kind: 'Uncontrolled early device series, 116 implants, mixed indications', says: 'Eight revisions (6.9%), no reported infections and 93.2% twelve-month Kaplan–Meier device survival; four revisions were attributed to sizing errors. Device survival is not continence, there is no comparator, and only abstract-level results were accessible.' },
  MASTER22: { name: 'MASTER trial 2022 (Constable et al., NIHR HTA)', kind: 'UK multicentre randomised non-inferiority trial, 380 men, sling versus AUS', says: 'At twelve months the sling met non-inferiority on the patient-reported continence endpoint (difference −3.4 points, 95% CI −11.7 to +4.8, 15-point margin). Both groups improved and several secondary outcomes favoured AUS. Prior implants and unresolved narrowing were excluded, so it says nothing about complex revision practice.' },
  UDS09: { name: 'Lai et al. 2009: urodynamics before AUS', kind: 'Selected cohort, 129 first AUS after prostatectomy, mean follow-up 34 months', says: 'Adverse preoperative urodynamic findings did not significantly worsen later pad use, but the authors warned that a good continence result with poor compliance can still expose the upper tracts to high storage pressure. It separates pad outcomes from bladder safety; it does not say abnormal UDS can be ignored.' },
  OAB11: { name: 'Lai and Boone 2011: OAB and post-prostatectomy AUS', kind: 'Selected cohort, 129 first AUS after prostatectomy', says: 'Preoperative OAB did not worsen overall continence, but 71% with mixed symptoms still had OAB afterwards and 23% with pure SUI developed new OAB. Stress leakage can improve while urgency persists.' },
  DO24: { name: 'Bhatt et al. 2024: preoperative DO systematic review', kind: 'Systematic review, 11 studies, 792 patients, AUS and sling', says: 'Did not find a statistically significant overall excess of failure sufficient to deny surgery solely because DO was present, but definitions and reporting were heterogeneous. It supports counselling about persistent storage symptoms; it does not promise urgency resolves.' },
  DOFAIL23: { name: 'Krughoff and Peterson 2023: earlier AUS reintervention', kind: 'Single-centre analysis of 92 men already undergoing reintervention', says: 'DO was associated with earlier reintervention (adjusted HR 1.95, 95% CI 1.22–3.1) within that selected group. It tempers reassurance; it cannot give the failure probability for all primary recipients.' },
  DU23: { name: 'Han et al. 2023: AUS with detrusor underactivity', kind: 'Retrospective cohort, 78 patients, 55 with BCI below 100', says: 'Postoperative residuals did not differ significantly by DU status, although flow stayed lower. It excluded complications needing revision within three months, which weakens the safety inference. BCI below 100 is the study definition, not an eligibility cutoff.' },
  CIC23: { name: 'Krughoff et al. 2023: intermittent catheterisation after bulbar AUS', kind: 'Retrospective selected cohort, 57 men with CIC history', says: 'Eighteen continued or started CIC after AUS; no statistically significant difference in erosion or later removal was found. Small numbers and selection mean a missed difference is possible. Feasible in carefully planned men; not equivalence to men who never catheterise.' },
  CATH13: { name: 'Seideman et al. 2013: prolonged catheterisation and erosion', kind: 'Observational implantation and revision cohort, 200 men', says: 'Urethral catheterisation for more than 48 hours was associated with erosion (17 of 44 exposed men), alongside radiation and revision. It supports avoiding unnecessary prolonged urethral access; 48 hours is not a guaranteed safe boundary.' },
  UDS14: { name: 'Weissbart et al. 2014: absent leak during intubated urodynamics', kind: 'Cohort, 169 men', says: 'Thirty-two men did not leak with the urethral test catheter in place and all leaked once it was removed, with useful later AUS outcomes. A catheter can mask real stress leakage; this does not justify skipping clinical demonstration.' },
  RT22: { name: 'Zhang and Xu 2022: radiation meta-analysis', kind: 'Meta-analysis of 18 observational studies', says: 'Prior radiation was associated with lower odds of complete continence and more erosion or explantation (pooled erosion OR about 2.0, 95% CI 1.15–3.45). An odds ratio is not a personal probability, and radiation is a counselling and tissue-planning factor, not an automatic exclusion.' },
  URETH26: { name: 'Davis et al. 2026: AUS after urethroplasty', kind: 'Retrospective multicentre series, 178 cases, 15 institutions', says: 'Complications requiring explantation occurred in 56.2% after transecting versus 23.5% after non-transecting urethroplasty. Selection, stricture severity and follow-up confound the comparison; it supports a detailed reconstructive history, not a claim that every transection was avoidable.' },
  TC20: { name: 'Redmond et al. 2020: transcorporal placement in fragile urethras', kind: 'Retrospective series, 76 patients, 24 transcorporal', says: 'Revision 20.8% versus 36.5% and erosion 8.3% versus 17.3%, numerically favouring transcorporal placement, but the erosion difference was not statistically significant and allocation was not randomised.' },
  TC23: { name: 'Kurtzman et al. 2023: high-risk transcorporal AUS', kind: 'Retrospective single-surgeon high-risk cohort, 68 men, 77 cuffs', says: 'Transcorporal placement was associated with more infection or erosion-related explants (HR 2.74). Surgeons may have chosen it for the worst tissue, so it cannot prove the technique caused harm. With Redmond it blocks any confident claim of erosion protection.' },
  ATROPHY20: { name: 'Bergeson et al. 2020: causes of AUS revision', kind: 'Selected contemporary revision cohort, 137 revisions, erosions excluded', says: 'Atrophy was assigned in 8% and pressure-regulating balloon failure in 34%. It tells us to check mechanics before labelling late leakage as atrophy; it does not show atrophy never occurs.' },
  PREP24: { name: 'Bourgi et al. 2024: AMS 800 skin-preparation protocols', kind: 'Retrospective sequential-era comparison, 156 procedures', says: 'Intensified povidone preparation showed no association with device removal (OR 0.97, 95% CI 0.28–3.37). Wide interval, era confounding and inconsistent reporting; it never compared fifteen minutes against a shorter preparation.' },
  YEUNG13: { name: 'Yeung et al. 2013: GU prosthetic skin preparation RCT', kind: 'Single-centre randomised trial, 100 initial GU prosthetic procedures, 50 per arm', says: 'Post-preparation skin cultures were positive in 8% with chlorhexidine-alcohol versus 32% with povidone-iodine (P = 0.0091). A microbiological surrogate in a mixed-device population; it did not show fewer AUS infections and tested no duration.' },
  ABX18: { name: 'Adamsky et al. 2018: postoperative oral antibiotics', kind: 'Claims-based observational study, 3,594 AUS recipients', says: 'Explantation within three months was 3.9% with and 4.0% without postoperative oral antibiotics, with no protective association after adjustment. It challenges routine prolonged oral prophylaxis; it cannot prove identical safety in every subgroup.' },
  TOUCH23: { name: 'Ziegelmann et al. 2023: minimal-touch AUS technique', kind: 'Historical comparison of a contamination-control bundle', says: 'Crude infections appeared lower after the bundle, but twelve-month cumulative incidence differences were not statistically significant. A sensible bundle to study; it cannot credit one glove change, drape or pause.' },
  LINDER15: { name: 'Linder et al. 2015: long-term primary AMS 800 outcomes', kind: 'Historical specialist cohort, 1,082 primary implants, median follow-up 4.1 years', says: 'Kaplan–Meier freedom from any secondary surgery was 74% at five years and 57% at ten years. This is maintenance and revision counselling, not pad-free continence.' },
  AUSCO26: { name: 'AUSCO study 2026 (Kaufman et al.): prospective AMS 800 outcomes', kind: 'Prospective single-arm, manufacturer-funded, 17 sites, 115 primary implants', says: 'At twelve months after activation 91 of 97 had at least 50% pad-weight reduction and 61 of 101 reported zero pads (60.4%); nine participants had revisions. Contemporary counselling data with missing denominators, expert centres and one year of follow-up; no device comparison.' },
  AUASTATUS26: { name: 'AUA current guideline register, July 2026', kind: 'Official register page', says: 'Still lists Incontinence after Prostate Treatment as amended in 2024; no 2026 amendment exists. Meeting abstracts and update courses are not a new guideline.' },
  BAUSDAY26: { name: 'BAUS 2026 abstract P4-8: day-case AUS audit', kind: 'Conference audit, 98 men', says: '88% same-day discharge in an established service. Short follow-up and a selected population; it does not establish long-term equivalence or antibiotic policy.' },
  BAUSSCI26: { name: 'BAUS 2026 abstract P12-7: bulbar AUS in spinal cord injury', kind: 'Small retrospective conference series', says: 'Explored predominantly bulbar placement in SCI. Small, selected, no bladder-neck comparator; a specialist discussion point that keeps safe storage and an emptying plan central.' },
  AUAUDS26: { name: 'AUA 2026 abstract IP09-22: pre-AUS urodynamics and cystoscopy', kind: 'Conference abstract, title and programme verified only', says: 'Revisited the value of preoperative UDS and cystoscopy. Full methods and results were unavailable, so no numerical result or change in practice is inferred.' },
  AUAABX26: { name: 'AUA 2026 abstract IP09-18: postoperative antibiotics', kind: 'Conference abstract, title and programme verified only', says: 'Its title states no infection benefit from postoperative antibiotics. Full methods and results were unavailable; nothing numerical is inferred.' },
  AUASAFER26: { name: 'AUA 2026 abstract IP09-17: SAFER erosion management', kind: 'Conference abstract, title and programme verified only', says: 'Compared in situ urethroplasty with conservative management at explantation for cuff erosion. Results were unavailable; no practice change is inferred.' },
  MASTER26: { name: 'MASTER 24-month results 2026 (Constable et al., Eur Urol Focus)', kind: 'Extended follow-up of the same 380 randomised men', says: 'Sling remained non-inferior on the strict self-reported continence endpoint at 24 months (difference −0.6 points, 95% CI −9.2 to +8.0). Further surgery: 11% after sling versus 2% after AUS; secondary outcomes generally favoured AUS. Non-inferiority on one endpoint is not identical effectiveness.' },
  URETHMETA26: { name: 'Prior urethroplasty meta-analysis 2026 (Deameh et al., Urology)', kind: 'Meta-analysis of four observational studies, 533 men', says: 'Prior urethroplasty was associated with higher explantation (RR 2.05, 95% CI 1.08–3.89); the pooled erosion difference was not significant. Transecting versus non-transecting repair was associated with more erosion (RR 2.34) and explantation (RR 2.38). Observational and partly overlapping with Davis; not causal.' },
  IRRIG26: { name: 'Gentamicin withdrawal cohort 2026 (Skrzypczyk et al., Antibiotics)', kind: 'Single-centre before-after study, 173 uncoated AMS 800 procedures', says: '90-day SSI 1 of 59 with gentamicin versus 2 of 114 without (difference +0.1 points, 95% CI −7.4 to +4.7). Three events in total, immersion and irrigation changed together, and broad systemic prophylaxis continued. Not equivalence, and not transferable to coated AMS 800 or ContiClassic.' },
  DAYMETA26: { name: 'Day-case AUS meta-analysis 2026 (Grigoryan et al.)', kind: 'Systematic review, six studies, 2,424 men; four pooled', says: 'No significant difference in retention (RR 1.44, 95% CI 0.81–2.56) or 90-day emergency visits (RR 0.91). Moderate-to-serious bias and wide intervals; same-day discharge is a selected pathway, not an instruction.' },
  DAYCASE26: { name: 'Day-case versus inpatient AUS 2026 (Youssef et al.)', kind: 'Retrospective single-centre comparison, 177 men', says: '30-day composite complications 11.3% ambulatory versus 8.2% inpatient, p = 0.78. Inpatient selection depended on ASA and social factors; a non-significant result is not proof of equal safety.' },
  FRAIL26: { name: 'Frailty and SUI surgery 2026 (Nik-Ahd et al., J Urol)', kind: 'Medicare claims cohort, 7,252 men, AUS and sling', says: 'Claims-defined frailty was associated with 30-day complications independently of age and comorbidity (adjusted RR 1.5 prefrail, 2.5 frail) and with revision or removal. Mixed procedures and a claims index; it validates no bedside pump score.' },
  PAD26: { name: 'Pad count versus 24-hour pad weight 2026 (Domínguez Argomedo et al., BJU Int)', kind: 'Retrospective analysis of prospective follow-up, 2,040 men, 8,787 paired measurements', says: 'Pad count tracked leakage well overall (Spearman rho 0.94), but two to four pads a day had considerable weight variability. Measure pad weight when the intermediate count leaves severity uncertain.' },
  PRBFAT26: { name: 'Pressure-regulating balloon fatigue 2026 (Salvino et al., Urology)', kind: 'Laboratory study of 32 retrieved balloons', says: 'Age correlated with stiffness and reduced wall thickness; microcracks appeared in the oldest specimens. Mechanistic evidence from selected retrieved parts; it does not tell us to replace a balloon because three years have passed.' },
  REGRET26: { name: 'Decisional regret after AUS 2026 (Roth et al., Eur Urol Open Sci)', kind: 'Retrospective single-centre survivor cohort, 91 respondents, median follow-up 82 months', says: 'Reoperation was the only independent predictor of regret (+18 points on the Decisional Regret Scale); continence benefit persisted but deteriorated over time. Counsel about residual leakage, future surgery and psychological burden.' },
  INSTR26: { name: 'AUS instrumentation knowledge survey 2026 (Girgin, Neurourol Urodyn)', kind: 'Self-selected survey of 286 Turkish urologists', says: 'Found training and confidence gaps in AUS deactivation and instrumentation. It supports device cards and an urgent-contact route; its proposed catheter sizes and durations cannot become universal rules.' },
  EROSION26: { name: 'Immediate urethral repair at explantation 2026 (Park et al., World J Urol)', kind: 'Selected single-centre series, 16 men, median follow-up 14 months', says: 'One stricture after repair (6.3%) but seven wound dehiscences needing closure (43.8%). No drainage-only comparator; it does not establish universal immediate repair.' },
  DEVICE26: { name: 'Emerging AUS devices review 2026 (Schnell et al., Neurourol Urodyn)', kind: 'Narrative review', says: 'Describes new hydraulic and electronic designs while stressing the lack of robust direct comparisons and long-term outcomes. Engineering advantages are not proven clinical superiority.' },
  SECOND26: { name: 'Second AUS survival, national French cohort 2026 (Tokarski et al.)', kind: 'National administrative cohort, 1,619 second implants', says: 'Reintervention-free survival 68% at five years and 61% at ten years; only 21% of men whose first device was removed received another. It strengthens consent about the path after erosion or explantation.' },
  TCSYS25: { name: 'Transcorporal placement systematic review, online 2025 (Domínguez Gutiérrez et al.)', kind: 'Systematic review, 20 studies, eight comparative', says: 'Transcorporal placement was associated with more revisions (OR 2.99), less erosion (OR 0.35) and less infection (OR 0.33), with no significant explantation difference. Non-randomised, heterogeneous risk selection, and the pooled estimates conflict with some cohorts.' },
  RTTIME25: { name: 'Radiation and cuff-removal timing cohort 2025 (Lee et al., World J Urol)', kind: 'Retrospective cohort, 283 men', says: 'Prior radiation was associated with cuff removal (HR 3.30, 95% CI 1.05–10.40). An exploratory trend towards later implantation after radiation was not significant and validates no waiting rule.' },
  UROACTIVE26: { name: 'UroActive electronic AUS first-in-human 2026 (Mozer et al., J Urol)', kind: 'Single-arm feasibility study, six men', says: 'All activated successfully with no explant or revision in the first year; nine device deficiencies involved the remote control. Zero revisions in six men is not zero risk.' },
  REPORT26: { name: 'Standardised complication reporting 2026 (Roessler et al., World J Urol)', kind: 'Retrospective series, 227 implants, systematic complication capture', says: '47% early complications, mostly minor; 7.9% major; five-year explantation-free survival 73%. Includes double and transcorporal cuffs, so it is not a universal primary single-cuff rate. It shows why similar-looking percentages differ.' },
};

// Spoken script for each teaching slide. `frame` says what the slide represents, `say` is the flowing
// narration (the 10 October "we" voice, kept), `transition` carries the audience to the next slide.
export const SCRIPT = {
  1: {
    frame: 'The decision lens for the whole hour: implant, optimise, investigate or reconsider.',
    say: [
      'An AUS can be a technically satisfactory implant and a disappointing treatment. The cuff may coapt, the pump may cycle, and the patient may still avoid leaving the house because urgency, difficult emptying or fear of another procedure dominates his life.',
      'Today we want to follow the decisions that separate those outcomes. We will start with what the patient actually wants, then examine the bladder and urethra that are to be operated on. We will spend time on evidence-based preparation and the small operative decisions that are difficult to rescue later.',
      'One question will keep coming back, and it is on the slide in four words. Would we implant now, optimise first, investigate further, or reconsider whether an AUS is the right treatment? Each of those choices needs a reason, and we will keep returning to them with four fictional patients.',
    ],
    transition: 'Before we use any of that evidence, we should be honest about what kind of evidence it is.',
  },
  2: {
    frame: 'The four kinds of authority we will cite, and the boundary between devices.',
    say: [
      'Thank you to Rigicon for organising the meeting. The clinical discussion needs to stay independent of the sponsor, so device choice should follow the evidence, patient suitability and the instructions for that device.',
      'We have useful guidance, but agreement among experts is not the same as a comparative trial. A manufacturer\'s instruction tells us how its product is intended to be used. It tells us nothing about whether that product outperforms another. A retrospective series can identify a concern without proving that the proposed solution prevents it.',
      'The BAUS consensus is particularly useful because it sets out the clinical pathway. We will compare it with EAU and AUA guidance where they differ. The ICS and Asia-Pacific consensus documents are also useful, but both are centred on the AMS 800.',
      'Our aims are to choose investigations sensibly, separate three different bladder problems, preserve a usable urethra, question preparation rituals and diagnose failure before choosing revision. Where the evidence stops, we will say so.',
    ],
    transition: 'So let us begin where the patient begins: with the leak itself.',
  },
  3: {
    frame: 'Characterising the leak and agreeing what improvement would be worth an implant.',
    say: [
      'Start with a description of a bad day. Does he leak when standing, walking or coughing? Does an urge come before the leak? Is he dry overnight, or does night-time leakage suggest another cause? Mixed symptoms are common, but the word mixed must not replace an explanation.',
      'Demonstrate stress leakage with a suitably filled bladder and a practical provocative test. If the history and examination disagree, investigate that disagreement. A dry examination just after he has emptied his bladder proves very little.',
      'Pad number is easy to record, but it depends on pad capacity and the patient\'s changing behaviour. The 2026 pad study tells us that count tracks leakage well overall, yet two to four pads a day hides a wide range of weights. A pad-weight assessment quantifies leakage when severity or progress is uncertain, provided the collection conditions and activity are recorded. A diary helps separate urinary frequency from precautionary voiding.',
      'Then ask what improvement would justify an implant. Walking the golf course, returning to work or managing with one precautionary pad may matter more than a label of continence. Record a validated symptom and quality-of-life measure, and keep the patient\'s own goal beside it.',
    ],
    transition: 'Once we know what he wants back, the next question is when, and whether an AUS is the only route there.',
  },
  4: {
    frame: 'When to operate after prostate treatment, and where the sling trial fits.',
    say: [
      'Do not let conservative management drift on indefinitely. But do not interrupt a convincing recovery without a reason either. Establish what has been tried, whether pelvic-floor training was properly taught, and whether leakage is still improving.',
      'BAUS allows a recovery period of at least six months for severe leakage and twelve for mild-to-moderate leakage. The AUA permits surgery from six months when bothersome stress leakage is not improving despite conservative treatment, and recommends offering it at one year when it persists. Anticipated salvage treatment, recurrence and the patient\'s recovery so far still belong in the decision.',
      'A sling remains an option for selected men with less severe leakage and favourable tissues. Severe leakage and previous radiation generally move the discussion towards AUS. The AUA specifically favours AUS over slings or adjustable balloons in irradiated men seeking surgery. Containment, collecting devices and continued conservative care remain legitimate choices.',
      'The MASTER trial supports an informed comparison. At 24 months the sling remained non-inferior on its primary continence endpoint, but further surgery was needed in eleven per cent after sling against two per cent after AUS. Non-inferiority on one endpoint does not make the procedures interchangeable in every subgroup. The trial excluded previous continence implants and unresolved narrowing, so it should not be applied to complex revision practice.',
    ],
    transition: 'Timing assumes the patient can use the device. That is the next thing to test, and we test it rather than ask about it.',
  },
  5: {
    frame: 'A demonstrated task: can this patient operate this pump now and in five years?',
    say: [
      'Ask the patient to operate a demonstration pump, and watch what happens. Arthritis, neuropathy, tremor and weak pinch may only show when he attempts the task.',
      'Access matters as much as strength. Can he reach the proposed side of the scrotum while seated? Obesity, a high scrotum, limited hip movement or another scrotal device can make a well placed pump unusable. Agree the side with him, because his dominant hand alone does not settle it.',
      'Check that he understands cycling, deactivation and what to tell another clinician before catheterisation. Cognitive decline and progressive disease change the long-term plan. Family support helps, but it does not automatically help a man who cannot operate the device when he is alone.',
      'Frailty is more than an age cutoff. The 2026 Medicare cohort links claims-defined frailty to early complications and to later revision, independently of age. Balance anaesthetic burden, recovery, expected benefit and the likelihood of future revision. If safe independent use is unlikely, reconsider the treatment.',
    ],
    transition: 'With the patient assessed, we turn to the two investigations that most often change the plan. First the cystoscope.',
  },
  6: {
    frame: 'What a flexible cystoscopy is for, and which findings change the plan.',
    say: [
      'The AUA recommends cystourethroscopy before stress-incontinence surgery. BAUS selects cystoscopy for indications alongside its video-urodynamics pathway, or combines it with standard urodynamics where video is unavailable. EAU describes selective cystoscopy for narrowing or bladder pathology, with a weak general recommendation when the findings would change diagnosis or treatment.',
      'Our practical preference before an AUS is to inspect the urethra and bladder in advance, so that an unexpected finding can be discussed before the day of implantation. That is our preference, because the guidelines do not agree. Repeat the assessment after any urethral treatment or new obstructive symptoms.',
      'Look for a stricture, vesicourethral anastomotic stenosis, bladder-neck contracture, foreign material or previous cuff erosion. Bladder stones, tumour and significant radiation changes may alter treatment or predict repeated instrumentation.',
      'With suspected narrowing, add flow and residual assessment and define the site and length. Retrograde urethrography, sometimes with a voiding study, is useful when reconstruction is being considered or the segment cannot be assessed endoscopically. And do not turn a diagnostic cystoscopy into an unplanned dilation simply to complete the examination.',
    ],
    transition: 'The second investigation is where the guidelines genuinely disagree, so we will name the positions rather than blur them.',
  },
  7: {
    frame: 'Three guidelines, three positions on urodynamics. We say which one we follow.',
    say: [
      'BAUS favours video-urodynamics in the surgical pathway. EAU recommends urodynamics before invasive treatment, with weak strength, and its narrative still discusses selective testing and limited outcome evidence. The AUA permits testing when it helps diagnosis or counselling. The older ICS consensus also takes a selective approach.',
      'The yield is greatest when stress leakage is uncertain, urgency is dominant, emptying is poor, compliance is a concern, or previous treatment has complicated the mechanism. In an uncomplicated man with demonstrable severe stress leakage, reassuring emptying and no worrying storage symptoms, urodynamics may add little under the AUA approach. BAUS and EAU still take a different position.',
      'Before requesting the test, state the question. Is this unsafe storage, obstruction, weak contraction, or a bladder that never gets a chance to fill? Decide in advance what would change surgery or counselling.',
      'We found no comparative trial showing that routine testing itself improves AUS outcomes for every candidate. A consensus can recommend a sensible investigation without proof that its universal use is superior. The 2026 AUA abstract revisits this question, but its full results were not available, so we quote the topic and nothing more.',
    ],
    transition: 'Whichever pathway you follow, the study you get back will be imperfect. Here is how we read it.',
  },
  8: {
    frame: 'A five-step way to read an imperfect urodynamic study beside the real patient.',
    say: [
      'A man who leaks throughout filling may never reach a meaningful storage challenge. A small recorded capacity can reflect leakage, urgency, discomfort, filling conditions or genuinely poor storage, and each of those leads to a different decision.',
      'Review the actual traces, pressure subtraction, filling rate, leakage and the reason filling stopped. A compliance value calculated during artefact or substantial unrecorded leakage carries no authority just because the machine printed it. Compare it with his diary and usual voided volumes.',
      'A catheter in place during a pressure-flow study may inhibit voiding or alter outlet behaviour. Weissbart\'s series is the reminder: thirty-two of 169 men did not leak with the catheter in and every one of them leaked once it came out. And a man who empties by abdominal straining through a very incompetent outlet may not behave the same after continence surgery. Repeat free flow and residual measurements under representative conditions, and explain the remaining uncertainty.',
      'The pathway runs like this. Establish the dominant symptom and demonstrable stress leakage. Assess urine, diary, flow and residual, and evaluate the urethral anatomy. Use the chosen guideline-based urodynamic strategy, then classify storage safety, emptying and outlet stability. If a study is technically inadequate and its result would decide whether implantation is safe, investigate further. An uninterpretable trace is neither a contraindication nor reassurance.',
    ],
    transition: 'When the assessment is complete, we consent. And consent is where the numbers need their denominators.',
  },
  9: {
    frame: 'Two honest numbers, each with its population, endpoint and time horizon.',
    say: [
      'Consent includes residual leakage, urgency, erosion, infection, mechanical failure and revision. Radiation and previous surgery change those risks, and future instrumentation needs precautions.',
      'AUSCO gives contemporary AMS 800 context: 115 primary implants, including 25 previously irradiated men. At twelve months after activation, 61 of 101 reporting participants used zero pads. It was a manufacturer-funded, single-arm study in expert centres, and missing outcomes and one-year follow-up limit what we can infer.',
      'The first 116-recipient ContiClassic series reported 93.2 per cent Kaplan–Meier device survival at twelve months. A standardised continence result and primary, revision or radiation subgroup outcomes could not be verified in the accessible abstract. That tells us about early device survival. It does not tell us about pad freedom, and it makes no comparison between devices.',
      'Quote each endpoint with its population and time horizon. The patient should know what the device may improve and what happens if it has to be removed. The 2026 regret study makes that concrete: reoperation was the only independent predictor of regret, and benefit faded with time, so future surgery belongs in the conversation from the start.',
    ],
    transition: 'That is the decision before theatre. Now let us put it to work with our first fictional patient, and hand the decision to you.',
  },
  10: {
    frame: 'Case 1 tests the lens on a bladder that leaks two ways: stress and urgency.',
    say: [
      'This fictional patient uses six pads on an active day. Stress leakage is clearly demonstrated. He also has urgency leakage, and urodynamics shows detrusor overactivity, with reassuring storage pressures between contractions and adequate emptying. His urethra is patent.',
      'Would you implant now or treat the bladder first? [Pause for eight seconds.] Both may be defensible in general AUS practice, depending on which symptom dominates, how severe the urgency is and what the device\'s instructions say.',
      'Overactive bladder is a symptom syndrome, whereas detrusor overactivity is an observation during filling. One does not perfectly predict the other. A systematic review found insufficient grounds to deny stress-incontinence surgery solely because DO was present, but the studies and definitions were heterogeneous. It does not guarantee that urgency or device durability is unaffected; in one reintervention cohort, DO went with earlier reintervention.',
      'Our approach would be to offer treatment for bothersome storage symptoms, agree a separate goal for urgency, and reassess. If stress leakage remains the dominant burden and storage is safe, AUS can remain appropriate. For ContiClassic specifically, the retrieved IFU requires these bladder conditions to be treated and controlled or resolved, and irresolvable instability is contraindicated. General reassurance about DO must not override that device boundary.',
    ],
    transition: 'So how do we treat that urgency without creating the next problem, an emptying problem?',
  },
  11: {
    frame: 'Treating urgency in the right order, with emptying and future access in view.',
    say: [
      'Begin with the reversible contributors: fluid pattern, caffeine, constipation, infection when clinically suspected, and medications. Bladder training and an appropriate antimuscarinic or beta-3 agonist may be useful, chosen with the patient\'s comorbidity, interactions and residual urine in mind. We are not prescribing a universal drug sequence.',
      'Botulinum toxin can be effective for refractory urgency, but think through its consequences before an AUS. Could this patient catheterise if needed? How would repeated cystoscopic injections be delivered safely through the future cuff? If retention develops, we have exchanged one functional problem for another. Neuromodulation can also be considered through an appropriate overactive-bladder pathway. We still need to establish that the outlet is stable and emptying is adequate.',
      'Return to the patient\'s two outcomes: stress leakage and urgency leakage. Lai\'s cohort tells us that most men with mixed symptoms still had urgency after a successful AUS. Improvement in one is not failure because the other persists, provided that possibility was properly discussed.',
      'But do not dismiss severe postoperative urgency as an inevitable inconvenience. Reassess it, including infection, residual urine and device function, before escalating medication.',
    ],
    transition: 'Our second patient has the opposite bladder problem. He cannot empty well even before we add a cuff.',
  },
  12: {
    frame: 'Case 2 asks whether a weak bladder with residual urine can safely take a cuff.',
    say: [
      'Our second fictional patient has demonstrable stress leakage but voids slowly, strains and repeatedly leaves urine behind. The pressure-flow study shows a weak contraction. Is that enough to refuse him an AUS? [Pause for eight seconds.]',
      'First exclude a narrowing, review medications and neurological history, and compare the laboratory void with his usual void. A large residual with a weak contraction still needs an explanation. A technically poor study should not define his future treatment.',
      'Selected retrospective data suggest that men labelled as having detrusor underactivity can do reasonably well after AUS. But that study excluded early complications requiring revision, and the accessible report does not allow confident extrapolation to every patient with severe retention or an acontractile bladder.',
      'An AUS opens during cycling, so it differs from a permanently obstructive outlet procedure. Even so, we cannot promise that a man who empties mainly by straining will empty equally well after implantation. Our initial decision is to investigate further and establish a practical emptying plan. If that becomes reliable, implantation may be reasonable. If he cannot empty or safely manage the likely rescue strategy, reconsider AUS. No universal residual or contractility number makes this decision for us.',
    ],
    transition: 'If his rescue plan is a catheter, we have to be clear about what catheterising through a cuff really involves.',
  },
  13: {
    frame: 'The non-negotiable rule for any instrument through a cuff, and the planning around it.',
    say: [
      'Intermittent catheterisation does not automatically exclude an AUS, but it changes both the consent and the operation. A small, selected retrospective series supports the feasibility of bulbar AUS in some men who continue catheterisation. It does not demonstrate equivalent safety to men who never catheterise.',
      'Clarify whether the problem is weak emptying, recurrent narrowing or an unresolved outlet that would be better treated first. Establish actual catheter competence, including access and recognition of resistance. We do not want to discover after implantation that the patient can squeeze a pump but cannot carry out the drainage plan.',
      'Any catheterisation requires the cuff to be fully deflated and the device deactivated according to its instructions. Use the least traumatic appropriate instrument, and stop when resistance is unexplained. A deflated cuff\'s advertised internal diameter is not a safe catheter-size chart, because urethral tissue occupies that space. A 2026 survey of urologists found real gaps in confidence about exactly this step.',
      'Repeated instrumentation and prolonged indwelling drainage need a specialist plan, which may include an alternative drainage route. Observational evidence links prolonged urethral catheterisation with erosion. It does not establish a universally safe duration, or prove that careful intermittent catheterisation carries the same risk.',
    ],
    transition: 'One more bladder problem remains, and it is the one that can look like success. A dry patient can still be unsafe.',
  },
  14: {
    frame: 'Two traces, two different problems: a contraction versus a sustained pressure rise.',
    say: [
      'Poor compliance needs its own decision. It describes the pressure-volume relationship during filling, not simply the presence of an involuntary contraction. The left trace is a transient contraction; the right is a sustained rise. An apparently dry patient may be storing urine at an unacceptable pressure.',
      'Check the trace and the circumstances. Was there a sustained rise in detrusor pressure, adequate filling and valid subtraction? Consider radiation, fibrosis, neurological disease and the effect of chronic leakage. Assess renal function and upper tracts when there is concern about high-pressure storage or impaired emptying.',
      'Optimise the bladder and repeat the assessment that will show whether storage is acceptable. Refractory cases may need reconstructive or diversion advice before anyone increases outlet resistance. Lai\'s 2009 cohort made exactly this point: pad results can look good while poor compliance still threatens the upper tracts.',
      'Our four decisions are now clearer. Implant when the leakage mechanism, storage, emptying and device suitability align. Optimise when a treatable bladder problem is dominant. Investigate when the measurements are unreliable or the mechanism uncertain. Reconsider AUS when safe storage, emptying or device operation cannot be achieved. Those categories are a clinical framework and have not been validated as a score.',
    ],
    transition: 'That closes the bladder. The urethra is next, and the first job there is simply to name the narrowing correctly.',
  },
  15: {
    frame: 'Three anatomically different narrowings that the word "stricture" hides.',
    say: [
      'The shorthand stricture hides different operations and different risks. An anterior urethral stricture involves the urethra and spongiosum. Bladder-neck contracture commonly follows surgery with part of the prostate still present. After radical prostatectomy, the relevant narrowing is usually the vesicourethral anastomosis. Use the anatomy in the discussion and in the referral.',
      'Review every dilation, urethrotomy and reconstruction, including the operative reports. Establish how quickly the narrowing recurred and whether patency currently depends on repeated calibration. Add imaging when the anatomy, length or reconstructive plan requires it.',
      'We call an outlet stable after a credible interval without recurrence, with symptoms, flow, residual and endoscopic findings that support a durable outlet. A scope that happened to pass once does not show that.',
      'Finally, think ahead. A patient who is likely to need further incision, tumour surveillance or treatment for radiation bleeding needs an access plan before a cuff makes those procedures more complicated.',
    ],
    transition: 'Stability is a finding, not a date on the calendar. Here is what the three guidelines actually say about the interval.',
  },
  16: {
    frame: 'Three intervals from three guidelines, each describing a different pathway.',
    say: [
      'BAUS recommends waiting at least six months after treating a post-prostatectomy narrowing, with no recurrence, before continence surgery. That is a genuine consensus recommendation, although it is not a randomised demonstration that six months is the unique safe interval.',
      'The AUA discussion describes interval cystoscopy at least four to six weeks after treatment of symptomatic bladder-neck contracture or anastomotic stenosis. That is a point for reassessment, with no guarantee that every reconstructed or irradiated urethra is ready for a cuff. EAU\'s three-to-six-month advice after redo vesicourethral anastomosis belongs to that particular reconstructive setting.',
      'Staged treatment lets us observe recurrence and avoid instrumenting a newly implanted cuff. Synchronous treatment has been reported in selected expert series, but should not become the default for aggressive, recurrent disease.',
      'Our decision would use the recurrence pattern, tissue quality, planned future access and the guideline context. A patient who has repeatedly restenosed after a short interval has not become low risk because the calendar reaches a convenient date.',
    ],
    transition: 'Our third patient brings all of that together, with radiation added.',
  },
  17: {
    frame: 'Case 3: an irradiated, repeatedly re-stenosing anastomosis and a man who wants to be dry now.',
    say: [
      'This fictional patient has had radical prostatectomy, salvage radiotherapy and repeated treatment of an anastomotic stenosis. He leaks severely when the outlet is open, but the narrowing returns. He understandably wants continence now.',
      'Would you put an AUS into that pathway? [Pause for six seconds.] Our first answer is to defer the implant and obtain a specialist reconstructive plan. Current patency is not durable, and more endoscopic treatment is likely. We also need to understand the bladder, including compliance and the burden of radiation cystitis.',
      'Radiation is associated with worse continence and greater erosion or explantation risk in pooled observational AUS studies, roughly a doubling of the odds of erosion. Those estimates combine different follow-up periods and case mixes, so they cannot give his personal probability of failure. A 2025 cohort found the same association with cuff removal and hinted at a timing effect, but that trend was not significant and sets no waiting rule.',
      'Definitive reconstruction followed by demonstrated stability and later AUS may be reasonable. In a devastated outlet with unsafe or intolerable bladder function, a different drainage or diversion strategy may ultimately offer the better life. There is more than one defensible endpoint. Repeatedly reopening a narrow lumen is not necessarily progress if it stops us agreeing a durable plan.',
    ],
    transition: 'Suppose he does get his reconstruction. What does a repaired urethra mean for the operation we would do later?',
  },
  18: {
    frame: 'How a previous urethroplasty changes the tissue available and the dissection we plan.',
    say: [
      'Previous urethroplasty covers several different operations. Was the urethra transected? Was there a graft, a posterior reconstruction, a prior cuff erosion or a fistula? Where is the viable spongiosum now? Those details should change where and how we dissect.',
      'The operation must preserve what remains. Avoid extending mobilisation through a repaired segment unless it is needed. A technically convenient cuff site may have poor tissue. If a safe plane cannot be established, pause and reconsider the approach or stage the operation.',
      'Davis\'s multicentre cohort reports very different later AUS outcomes after transecting and non-transecting urethroplasty, and the 2026 meta-analysis of 533 men points the same way: prior urethroplasty roughly doubles explantation, and transecting repairs carry more erosion and explantation. It adds evidence beyond the older guidance, but it remains observational. Stricture severity, anatomy, selection and unequal follow-up confound the comparison. It supports a more detailed reconstructive history and careful counselling; it cannot support a claim that every transection was avoidable.',
      'The practical point is to plan the reconstruction and any future continence surgery together. After previous erosion and explantation, healing, patency and realistic reimplantation expectations need to be demonstrated again.',
    ],
    transition: 'When the dorsal plane is hostile, one option is to go through the corpora. It is an option with a price.',
  },
  19: {
    frame: 'Transcorporal placement: a manoeuvre for a defined problem, with real costs and uncertain protection.',
    say: [
      'Transcorporal placement can avoid a hazardous dorsal dissection and include tunical tissue beneath part of the cuff. That is a plausible reconstructive purpose, but it does not prove protection from erosion.',
      'The comparative retrospective evidence points in different directions. Redmond\'s fragile-urethra series favoured it numerically. Kurtzman\'s high-risk series found more infection or erosion-related explantation in the transcorporal group. The latest systematic review pools twenty studies and suggests less erosion but more revision. Surgeons tend to select it for the worst urethras, so confounding by indication is substantial in both directions.',
      'Discuss corporal bleeding, erectile consequences and the implications for an existing or future penile prosthesis. Sizing must account for the tissue actually enclosed, using the relevant device protocol and no improvised correction factor.',
      'Tandem cuffs, wraps, relocation and capsular procedures also consume tissue or add complexity. Choose a manoeuvre because it addresses a demonstrated problem, and state its limitation. If the proposal is simply to squeeze a failing urethra harder, the diagnosis and the endpoint need another look.',
    ],
    transition: 'That is the urethra. Now a different kind of decision: the things we do before the skin is opened, and whether the evidence supports them.',
  },
  20: {
    frame: 'The fifteen-minute wash: first identify which activity we mean.',
    say: [
      'Is a fifteen-minute wash or scrub necessary before AUS implantation? We found no direct evidence that establishes a universal requirement.',
      'NICE advises soap washing the day before or the day of surgery. That is different from operative skin preparation, surgical hand antisepsis, wound irrigation, external device dipping and internal device filling. Identify the activity before debating its duration.',
      'BAUS recommends a five-minute topical field scrub by Delphi consensus, and acknowledges that this is extrapolated from penile prosthesis and other implant surgery. It does not establish fifteen minutes as an AUS standard. For hands, use the selected product\'s surgical antisepsis instructions. For the patient\'s skin, use the appropriate product and its application, contact and complete drying requirements.',
      'Waiting fifteen minutes cannot compensate for missed skin, an unsuitable product, pooled alcohol or a contaminated field. The lack of evidence for this ritual does not make antisepsis dispensable. We need correct, reproducible preparation.',
    ],
    transition: 'What the studies can actually support is narrower than the folklore, and here is the best of them.',
  },
  21: {
    frame: 'One good randomised trial with a surrogate endpoint: skin cultures, not implant infections.',
    say: [
      'In a randomised study of one hundred patients having initial genitourinary prosthetic surgery, chlorhexidine-alcohol produced fewer positive post-preparation skin cultures than povidone-iodine. The reported proportions were eight versus thirty-two per cent. That is a microbiological endpoint in a mixed prosthesis population. The study did not show fewer ContiClassic infections.',
      'A later retrospective AMS 800 study compared different povidone preparation protocols. It did not show an advantage for the intensified protocol, but era effects, reporting inconsistencies and limited follow-up reporting weaken the inference. It did not compare fifteen minutes against a shorter preparation.',
      'General SSI guidance supports an appropriate alcohol-based preparation where suitable, with alternatives for contraindications or anatomical requirements. The exact product matters around genital skin and mucosa. Check allergy, permitted application sites and the product information before applying a study\'s formulation to every field.',
      'Do not remove hair routinely. If it is required for exposure or adhesion, clipping on the day is the general NICE recommendation, and avoid skin trauma. Before draping and diathermy, confirm drying and the absence of pooling in skin folds or under the patient. Those are practical safety requirements, whatever the stopwatch says.',
    ],
    transition: 'Skin is one disagreement. Urine and antibiotics are another, and here the sources genuinely conflict.',
  },
  22: {
    frame: 'Four questions where guidance, evidence and the device label disagree, stated openly.',
    say: [
      'Treat symptomatic urinary infection and reassess before elective implantation. Asymptomatic bacteriuria is different.',
      'BAUS asks for a preoperative urine sample and treatment of infection. IDSA specifically suggests against screening for or treating asymptomatic bacteriuria solely for AUS implantation, although that recommendation rests on very low-quality evidence. Procedures involving urinary mucosal trauma are a separate situation.',
      'Agree the urine pathway with local microbiology, and do not equate every positive culture with symptomatic infection. Choose prophylaxis using the implant policy, previous isolates, allergies and renal function. Complete administration at the appropriate time before incision, and redose when the agent and procedure require it.',
      'Observational AUS evidence has not shown a convincing benefit from routine postoperative oral antibiotics; Adamsky\'s claims cohort found explantation rates of 3.9 and 4.0 per cent with and without them. However, the retrieved ContiClassic IFU describes forty-eight hours of intravenous antibiotics and five days of oral antibiotics after discharge as general care. That conflicts with shorter-prophylaxis stewardship approaches. We would respond by verifying current regional labelling and agreeing a documented protocol with the implant service and microbiology. Do not silently ignore either source, and do not describe an extended regimen as universally proven to prevent infection.',
    ],
    transition: 'Once the patient is prepared, the remaining risk is what we do with our hands and the implant.',
  },
  23: {
    frame: 'Four practical contamination controls, offered as rationale rather than proof.',
    say: [
      'There are sensible ways to reduce contamination. Prepare the equipment before opening the implant, establish a protected sterile handling area, minimise skin contact, and avoid unnecessary traffic and repeated hand-offs.',
      'Our preference is fresh sterile gloves before handling the device and after any contamination concern. We offer that as a practical control, without claiming that each glove change has been proven to reduce AUS infection. Minimal-touch AUS series are encouraging, but they compare different eras and unequal follow-up. We cannot attribute their results to one drape or one manoeuvre.',
      'Separate wound irrigation from device dipping and internal filling. General NICE guidance does not support wound irrigation solely to prevent SSI. AUS consensus literature also acknowledges uncertainty about antibiotic irrigants. The 2026 gentamicin-withdrawal cohort saw one infection in 59 procedures with gentamicin and two in 114 without; three events cannot prove equivalence, and immersion and irrigation changed together. A hydrophilic coating\'s ability to absorb a solution does not establish that any chosen antibiotic mixture improves clinical outcomes.',
      'For ContiClassic, follow the verified device instructions and obtain the operative protocol for detailed preparation. Do not substitute a remembered AMS 800 recipe or improvise an unverified antiseptic bath for an implant.',
    ],
    transition: 'All of this collapses into one checklist that the whole team runs before the implant is opened.',
  },
  24: {
    frame: 'The checklist we would actually use, with each row labelled by the kind of authority behind it.',
    say: [
      'Before opening the implant, confirm the patient, intended operation, tissue concerns and stop conditions. Review urinary and skin infection concerns, prophylaxis delivery and the redosing plan. Confirm that the preparation is anatomically suitable and dry.',
      'Then confirm the exact device and compatible components, available cuff sizes, planned pressure range, current instructions and the person responsible for preparation. Agree the catheter and postoperative rescue plan.',
      'Finally, establish what happens if the urethra is injured or sterility is compromised. A checklist is most useful when it makes that response predictable. Notice the last row: a fixed fifteen minutes, the best irrigant and prolonged prophylaxis sit there as unresolved evidence, not as requirements.',
      'Audit completion of these steps. The duration of a wash is not a measure of the quality of the whole operation.',
    ],
    transition: 'Now into theatre. The next eight slides follow the operation in order, and the model will show us each space.',
  },
  25: {
    frame: 'Positioning that serves the anatomy we have, and an access plan for all three components.',
    say: [
      'Positioning should expose the bulbar urethra while protecting pressure points and respecting hip mobility. Check the patient before anaesthesia when restricted movement is likely to matter. Do not accept excessive flexion simply because it improves the first view.',
      'For a standard male bulbar implant, a single-cuff perineal approach has guideline support. Other approaches may be appropriate for selected anatomy and experienced operators, but convenience alone should not determine access to a compromised urethra.',
      'Plan where the balloon and pump will go at the same time. Previous pelvic surgery, inguinal mesh, abdominal scars and an existing penile prosthesis alter that plan. Have the relevant operative records available.',
      'If exposure is poor, improve the incision, retraction or positioning deliberately. Excessive traction to compensate for a small working space transfers force to the urethra. The purpose of exposure is to make the next decision visible, and a shorter incision is not worth losing that.',
    ],
    transition: 'With the urethra exposed, the next decisions are about which tissue the cuff will sit on, and how much of it we disturb.',
  },
  26: {
    frame: 'The cuff-bearing segment: enough controlled exposure, and no more mobilisation than the cuff needs.',
    say: [
      'The goal is a cuff around a viable urethral segment, not a completely skeletonised urethra. In a straightforward case, the proximal bulbar region often offers useful spongiosal tissue. Prior repair, erosion or scarring may change which segment is safest.',
      'The dorsal relationship to the corporal bodies is where a small error can become a full-thickness injury. Use controlled dissection with a clear view of the plane. Do not pass an instrument blindly behind the urethra and assume that resistance is a harmless adhesion.',
      'Preserve spongiosum and vascular attachments, limit circumferential mobilisation to what the cuff requires, and control bleeding without indiscriminate thermal injury. In scarred tissue, repeated forceful spreading can do more damage than a deliberate change of approach.',
      'If the plane disappears, stop. Improve the view, reassess the site or seek reconstructive help. Transcorporal placement may be an option in selected hands, but it should be a considered plan with consent and appropriate expertise. Tissue preservation has a clear biological rationale. The contribution of each manoeuvre to erosion prevention has not been separated in high-quality comparative trials.',
    ],
    transition: 'Once the segment is chosen, we measure it. And measurement is where the most avoidable errors live.',
  },
  27: {
    frame: 'Measuring the tissue the cuff will actually enclose, with the device\'s own method.',
    say: [
      'Measurement fails when the tissue being measured is not the tissue the cuff will finally enclose. Retraction can stretch the urethra, and a tight measuring tape can compress it. Included fat, scar or muscle can enlarge the apparent circumference, and haematoma and tissue distortion add further uncertainty.',
      'Relax the traction, confirm the plane and use the manufacturer\'s sizing method. Recheck an implausible reading; do not select the familiar size from memory. In a reconstruction or transcorporal operation the enclosed tissue is different, so do not apply an unsupported numerical adjustment simply because it is traditional.',
      'Too small a cuff can cause excessive compression, retention and tissue injury. Too large a cuff can leave poor coaptation and persistent leakage. Neither problem is reliably solved by choosing a stronger pressure-regulating balloon. Assess the final relationship and device function, with an appropriate integrity check when indicated. If the finding and the measurement disagree, investigate the discrepancy.',
      'The early ContiClassic safety series included revisions attributed to sizing errors, four of its eight. That reinforces the importance of this step without telling us which sizing strategy is superior. More available sizes may help a surgeon choose a fit. Their availability alone is not evidence of better long-term continence or less erosion.',
    ],
    transition: 'Sometimes the dissection or the measurement reveals something that changes what today\'s operation is for.',
  },
  28: {
    frame: 'The stop conditions: a recognised injury or a lost sterile field changes the endpoint.',
    say: [
      'Suspect injury when the plane is wrong, the wall appears breached, fluid escapes or there has been difficult instrumentation. Inspection, an appropriate controlled leak test and cystoscopy can help, but a negative test does not make aggressive dissection harmless. No single test has proven superiority for preventing erosion.',
      'Recognised urethral injury should change the objective of the operation. Stop implantation, define the injury, repair when appropriate and establish suitable drainage. Explain the change to the patient afterwards, and plan reassessment of healing and patency before considering another implant. Consensus intervals are guides. The injury and the reconstruction determine the actual pathway.',
      'For contamination, stop handling the device and identify what has been contaminated: a glove, instrument, component or the operative field. Replace contaminated disposable components and restore a clean setup as appropriate. Gross contamination or an uncertain tissue field may justify abandoning implantation and staging it.',
      'These are single-use implants. A dropped or contaminated component should not return to service after an improvised antiseptic soak. Finishing with no implant can be the correct outcome when the conditions for safe implantation have gone.',
    ],
    transition: 'If the cuff is safely placed, two separate decisions remain for the balloon: where it goes, and which pressure component we choose.',
  },
  29: {
    frame: 'Balloon pocket and pressure component: two decisions, two device-specific labels.',
    say: [
      'A routine retropubic pocket can become hazardous after pelvic surgery, radiation, mesh repair or previous implants. Review that anatomy before entering the space. Do not overcome unexpected resistance with a stronger finger or instrument: bladder, bowel and vessels may be close to the intended route.',
      'An alternative ectopic or submuscular position may be appropriate in experienced hands, with attention to the device\'s permitted placement, secure coverage, access and tubing route. These approaches also have limitations, including malposition, palpability and herniation. A different pocket is only safer if it is created correctly.',
      'Pressure selection is a separate issue. ContiClassic labelling lists ranges including sixty to sixty-nine centimetres of water. AMS 800 consensus commonly discusses sixty-one to seventy. Those labels must not be treated as interchangeable operative instructions.',
      'The public ContiClassic IFU confirms sterile saline filling but directs detailed implantation to a separate Operating Room Protocol. Without that protocol we cannot verify a filling volume or a universal pressure-selection algorithm. Confirm both before surgery. And increasing pressure should never be a substitute for diagnosing a poor cuff fit or a failing urethra.',
    ],
    transition: 'The third component is the one the patient will touch every day.',
  },
  30: {
    frame: 'A pump position that works for this patient, standing, seated and swollen.',
    say: [
      'The pump position is part of the functional result. The patient has already shown us where he can reach, which hand he uses and whether another scrotal device causes confusion. Use that information.',
      'A dependent, accessible position is generally useful, but the exact pocket must suit the patient and device. Too much dissection can encourage migration. Too little space or excessive tension can cause pain, poor access or pressure on adjacent tissue. Keep the pump distinct from the testis and avoid thin, threatened skin.',
      'Before closure, consider how the pump will sit when the patient stands, and whether the tubing will pull it upwards. Check that its orientation permits both normal cycling and access to the deactivation control.',
      'A demonstration pump that is easy to feel on a table does not tell us that a swollen postoperative scrotum will be easy to use. Check accessibility again at activation, with the patient performing the task.',
    ],
    transition: 'Then we finish the system, and we hand over the risk with it.',
  },
  31: {
    frame: 'Four verifications before closure, and a handover that protects the patient from the next catheter.',
    say: [
      'Follow each tube between components. Avoid tension, excessive loops, kinks and entrapment during closure. Keep needles and instruments away from the components.',
      'Prepare and connect the system using its own operative protocol. Use compatible components, remove air as instructed and verify the connections. Cycle the device to check function, then confirm that the cuff is open and the device correctly deactivated. Pressing a button without establishing the cuff state is not enough.',
      'Choose an appropriate small, atraumatically placed catheter for the individual cuff and urethra, and plan early removal after an uncomplicated implant. Device instructions, an injury or a reconstruction may change that plan, and no universal catheter size should be improvised.',
      'The handover should record the model, cuff site and size, balloon specification and position, deactivated state, catheter plan and contact details. The next clinician must know there is an AUS before attempting drainage. The 2026 survey of urologists is the reason we labour this: the gap in deactivation confidence is real.',
    ],
    transition: 'Let us now see all three spaces together on the model, and follow the tubing between them. Four minutes.',
  },
  32: {
    frame: 'Four minutes on the UroOps 3D model: cuff and dorsal plane, pump access, balloon pocket, tubing route.',
    say: [
      'Open uroops3d.com/lab/aus and use the scene controls. Say aloud that this is a teaching schematic with clinical review pending; it shows spatial relationships, not validated anatomy, perfusion or operative instructions.',
      '00:00–00:20: Transition to anatomical relationships. 00:20–01:05: Cuff site view. Discuss viable bulbar tissue and supporting spongiosum. 01:05–01:45: Surgeon\'s view. Discuss the dorsal plane and why scarred tissue changes dissection. 01:45–02:20: The three spaces view. Discuss accessible pump position. 02:20–03:10: Space of Retzius view. Discuss how previous surgery changes balloon access; describe alternative pockets verbally if absent. 03:10–03:45: Final configuration view. Trace tubing without claiming the schematic proves tension or perfusion. 03:45–04:00: Return to postoperative care.',
      'If loading fails, keep this slide displayed and use the spoken fallback below. Do not spend the allocated session troubleshooting beyond the opening twenty seconds.',
      'FALLBACK 00:00–00:20: "The model is not loading, so let us walk through the same anatomy verbally. Picture the bulbar urethra in the perineum, the pump in the scrotum and the balloon beneath the abdominal wall. We will connect each position to one operative decision."',
      'FALLBACK 00:20–01:05: "Begin with the cuff. It surrounds the urethra and its supporting spongiosal tissue. Our task is to identify a viable segment and preserve that support while creating only the space the cuff needs. A thin, scarred or previously eroded segment does not become healthy because it accepts a measuring tape. The operative report from previous reconstruction is therefore part of the anatomical assessment. Before measuring, release traction and check that the tape encloses the tissue the cuff will actually surround."',
      'FALLBACK 01:05–01:45: "Dorsally, the urethra lies closely related to the corporal bodies. In a normal plane, controlled dissection separates the structures. In a scarred plane, blind force may cross the urethral wall. The decision is to improve exposure, choose another strategy or stage the operation. Transcorporal placement may avoid a particular dangerous plane, but its comparative protection against erosion remains uncertain. It also changes the tissue within the cuff and the implications for future corporal surgery."',
      'FALLBACK 01:45–02:20: "Next, put the pump in the patient\'s hand, mentally. Can he find it, distinguish it from the testis and reach its controls? The position must work when sitting as well as standing. An oversized pocket permits migration, while tension and crowding cause discomfort. This is why pump access is agreed before anaesthesia. At activation, let him demonstrate the full operation rather than merely identify where the pump sits."',
      'FALLBACK 02:20–03:10: "Now consider the balloon. After pelvic surgery, the retropubic space may not behave like the textbook space. Adhesions, mesh, bowel, bladder and vessels change the route. An alternative submuscular pocket may be useful, but it must be deliberately and safely created. The choice of pocket and the choice of pressure are separate decisions. Neither a new pocket nor a higher pressure compensates for a poorly selected cuff site. Unexpected resistance during access should prompt reassessment, not force. Confirm the actual product\'s placement and preparation instructions before committing to the pocket."',
      'FALLBACK 03:10–04:00: "Trace the tubing between all three components. Avoid tension, sharp turns and entrapment under closure. Recheck connections, cycle the system and confirm an open cuff with correct deactivation. The same route helps us investigate a later failure: patient operation, cuff and urethra, tubing, then balloon and fluid system. Future instrumentation has to pass through the cuffed segment, so deactivation and appropriate instrument selection remain essential even when the hydraulics work normally. That is the anatomical logic we wanted the model to demonstrate. Let us return to postoperative care."',
    ],
    transition: 'Back from the model: the operation is finished, and the first weeks decide whether it was worth doing.',
  },
  33: {
    frame: 'The planned aftercare, and the symptoms that bring the patient back early.',
    say: [
      'After uncomplicated implantation, remove the catheter early and check voiding. Persistent retention needs assessment of deactivation, oedema, cuff fit and obstruction, with safe drainage and no repeated blind catheter attempts. Selected day-case pathways are feasible: the BAUS 2026 audit discharged 88 per cent the same day, and the 2026 meta-analysis found no significant excess of retention or emergency visits, with wide intervals. That supports a selected pathway with verified emptying, not a universal instruction.',
      'Worsening pain, erythema, discharge, fever or voiding difficulty needs specialist review. Suspected erosion requires device-aware investigation, and established infection or erosion generally needs explantation, not antibiotics alone.',
      'ContiClassic specifies four to six weeks deactivated, until pain and oedema settle. At activation, verify patient operation and emptying. Arrange subsequent functional review and access for problems.',
      'Give him the device card and clear instructions to alert clinicians before catheterisation or endoscopy. Safe future care depends on that information reaching the person holding the instrument.',
    ],
    transition: 'Our last patient did everything right and was dry for three years. Then he was not.',
  },
  34: {
    frame: 'Case 4: late leakage is a diagnosis to make, not a cuff size to shrink.',
    say: [
      'Our fourth fictional patient had three useful years with his AUS and now leaks again. Would you book a smaller cuff? [Pause for five seconds.]',
      'Start by separating persistent leakage since activation from true recurrence after a successful interval. Ask whether this is activity-related leakage, urgency, overflow or difficulty cycling. Observe his technique and check the device state.',
      'Review urine and residual, examine the components, and use appropriately deactivated cystoscopy to look for erosion and assess the urethra. Investigate fluid loss, mechanical problems and bladder dysfunction as indicated.',
      'Urethral atrophy is an explanation to establish, not a diagnosis made by the passage of time. Bergeson\'s revision series attributed only eight per cent of failures to atrophy and a third to the pressure-regulating balloon, and the 2026 laboratory study of retrieved balloons shows why: they stiffen and thin with age. That is a mechanism, not an instruction to replace every balloon at three years. Capsular restriction and poor initial sizing can also complicate the label.',
      'The answer may be retraining, bladder treatment, component revision, a revised cuff strategy or explantation. In an older system, discuss whole-system replacement. The French national cohort reminds us that second implants have 68 per cent reintervention-free survival at five years, and that only a fifth of men whose first device was removed ever received another. Repeated failure or a compromised urethra warrants specialist review before another tissue-consuming procedure.',
    ],
    transition: 'So where does all this leave us? Here is what we think is established, and what honestly is not.',
  },
  35: {
    frame: 'What is supported, what is plausible, and what remains open.',
    say: [
      'AUS can deliver substantial benefit, with revision and erosion part of its lifetime burden. Tissue preservation, contamination control and planned instrumentation have strong rationale, although individual technical details often lack comparative evidence.',
      'We cannot name one best salvage operation for every fragile urethra, one optimal irrigant or a proven universal preparation duration. New device features, including the first electronic sphincters, need outcome evidence with comparable populations and definitions before engineering advantages become clinical claims.',
      'Make that uncertainty visible in consent and operative planning.',
    ],
    transition: 'Let us condense the hour into ten decisions. Five belong before theatre.',
  },
  36: {
    frame: 'The five pre-theatre decisions in one list.',
    say: [
      'The first five take-home messages belong before theatre. Establish the leakage mechanism and the improvement that matters. Watch the patient use a pump and assess access over time. Choose investigations to answer explicit questions, acknowledging the differences between guidelines.',
      'Keep detrusor overactivity, underactivity and poor compliance separate, because they lead to different decisions. Finally, establish a stable outlet and think through future instrumentation.',
      'A successful implant starts with a patient, bladder and urethra that can support the intended result. Apply them to the cases: optimise case one, investigate case two, and stage a reconstructive plan for case three.',
    ],
    transition: 'And five decisions protect the result once the implant is open.',
  },
  37: {
    frame: 'The five decisions that protect the result, from preparation to revision.',
    say: [
      'Preparation must be correct for the product, anatomy and implant pathway. A fifteen-minute ritual is not a substitute. In theatre, preserve the tissue you need, measure what the cuff will actually enclose, and correct uncertainty before closing.',
      'Use the instructions for the device being implanted. Similar components do not make pressure ranges, preparation or operating sequences interchangeable. Recognised injury or unsafe contamination is a reason to change the plan.',
      'Confirm the cuff state, drainage and the patient\'s ability to use the device. Make future instrumentation precautions explicit.',
      'When leakage returns, diagnose it before selecting a smaller cuff or higher pressure. The goal is useful continence over time, with safe storage, emptying and an agreed plan for further treatment.',
    ],
    transition: 'That is our ten. The last five minutes are yours.',
  },
  38: {
    frame: 'Five minutes of moderated discussion on decisions, not preferences.',
    say: [
      '55:00–55:20: "We would like to use these final five minutes on decisions rather than preferences alone. Choose one of the cases, tell us what you would do, and identify the finding that would make you change your plan."',
      '55:20–57:20: Invite a response on bladder dysfunction or urethral stability. Take one contrasting view and a brief reply. Ask, if needed: "Is that a guideline requirement, a device instruction, or your interpretation of the evidence?"',
      '57:20–59:40: Invite a second question on operative practice, preparation or failure. Use the prepared answers in the presenter guide if relevant. Keep individual contributions brief enough to allow disagreement and clarification.',
      '59:40–60:00: "Thank you. The useful differences are now clear: what the evidence supports, what the device requires and where our judgement remains decisive. Those distinctions should be visible in our consent, our operation notes and the outcomes we report."',
      'A show of hands is audience opinion; do not convert it into consensus evidence. For a question beyond the retrieved evidence, state the uncertainty precisely.',
    ],
    transition: '',
  },
};

// Notes for non-teaching slides.
export const COVER_NOTES = 'Cover, displayed before the timed teaching session. Presenters: Mr Andrew Baird, Urology Consultant; Mr Abu Yousif, Urology Consultant; Nity G, ST5 Urology Registrar. Add the meeting and date on the slide. Add personal disclosures to teaching slide 02 before presenting.\n\nImage: UroOps 3D teaching schematic of the implanted device, captured from https://uroops3d.com/lab/aus on 10 October 2026, with clinical review pending. It is not a record of an actual operation. No personal operative experience or local outcomes are asserted.';

export const IMAGE_CREDIT = 'Image: UroOps 3D, https://uroops3d.com/lab/aus . Captured 10 October 2026. © UroOps3D / UroRef / Nity G. Teaching schematic with clinical review pending. It illustrates spatial relationships, not validated anatomy, tissue perfusion or operative instructions.';
export const CLIP_CREDIT = 'Animation and image: UroOps 3D, https://uroops3d.com/lab/aus . Captured 10 October 2026. © UroOps3D / UroRef / Nity G. Teaching schematic with clinical review pending. It illustrates spatial relationships, not validated anatomy, tissue perfusion or operative instructions. The clip starts and loops by itself in slide-show mode.';
export const DEVICE_CREDIT = 'Image source: Rigicon ContiClassic IFU, CC-IFU REV.03, 12 October 2023, printed page 1 (PDF page 4). https://www.rigicon.com/files/e-labeling/ContiClassic-IFU.pdf . Manufacturer illustration, shown for component identification, without a comparative superiority claim.';

export const BACKUP_NOTES = {
  outcomes: 'Backup, outside the timed talk. Outcome definitions, populations and limitations follow the repository outcome-context table.\n\nAUSCO26: 91/97 achieved at least 50% pad-weight reduction (93.8%); 61/101 reported zero pads (60.4%). Prospective single-arm, manufacturer-funded, 17 sites; nine revisions in the reported period. https://pmc.ncbi.nlm.nih.gov/articles/PMC12794701/\nLINDER15: 1,082 primary implants; Kaplan–Meier freedom from any secondary surgery 74% at five years and 57% at ten years. Historical specialist cohort. https://pubmed.ncbi.nlm.nih.gov/26135815/\nCCSAFETY: 116 implants, eight revisions (four attributed to sizing), 93.2% twelve-month Kaplan–Meier device survival. Device survival is not continence; no comparator. https://pubmed.ncbi.nlm.nih.gov/37543658/\n\nNewer context: REGRET26 (reoperation the only independent predictor of regret, +18 points; benefit deteriorated over time; survivor cohort, no non-surgical comparator) https://doi.org/10.1016/j.euros.2025.12.006. SECOND26 (1,619 second implants; reintervention-free survival 68% at five and 61% at ten years; only 21% of men whose first device was removed received another) https://doi.org/10.1590/s1677-5538.ibju.2025.0374. REPORT26 (227 implants with systematic complication capture: 47% early, mostly minor; 7.9% major; 73% five-year explantation-free survival; includes double and transcorporal cuffs) https://doi.org/10.1007/s00345-026-06246-y.',
  comparative: 'Backup, outside the timed talk.\n\nMASTER26: extended follow-up of the same 380 randomised men. At 24 months sling met the prespecified non-inferiority criterion on the strict self-reported continence endpoint: risk difference −0.6 percentage points (95% CI −9.2 to +8.0). Further surgery 20 men (11%) after sling and four (2%) after AUS. Secondary outcomes generally favoured AUS. Non-inferiority on one endpoint is not identical effectiveness, zero-pad equivalence or an endorsement for irradiated or reconstructed revision cases. https://doi.org/10.1016/j.euf.2026.07.012\n\nYEUNG13: 4/50 versus 16/50 positive post-preparation skin cultures (8% versus 32%) in mixed GU prosthetic procedures; a surrogate endpoint, not AUS infection or a duration trial. https://pubmed.ncbi.nlm.nih.gov/23164373/\n\nIRRIG26: 173 uncoated AMS 800 procedures in 164 men, 59 with and 114 without gentamicin. 90-day SSI 1/59 (1.7%) versus 2/114 (1.8%); risk difference +0.1 points (95% CI −7.4 to +4.7). Three events; immersion and irrigation changed together; broad IV and ten-day oral prophylaxis continued. Not equivalence; not transferable to coated AMS 800 or ContiClassic. https://doi.org/10.3390/antibiotics15090894\n\nPREP24 remains in the bibliography as an earlier sequential preparation study: https://tau.amegroups.org/article/view/130351/html',
  gaps: 'Backup, outside the timed talk. Evidence gaps preserved from section 7 of the manuscript. No new clinical thresholds or device superiority claims are introduced. Each gap needs a defined population, intervention and meaningful outcome before it becomes a trial question.',
  video: 'Backup, outside the timed talk. A recorded run-through of the UroOps 3D AUS lesson (102 seconds, no sound), for use only if the live page on teaching slide 32 cannot be opened. Click the video to play. ' + IMAGE_CREDIT.replace('Image:', 'Video:'),
};

export const REFERENCE_NOTES = 'Reference slide, outside the timed talk. Every entry is a live hyperlink. Source dictionary checked 5 October 2026; study design, findings, limits and access level for each code are in presenter-guide/AUS-ST5-presenter-guide.md and in the "Studies on this slide" block of each teaching slide\'s notes. Older sources remain when they answer a different question from newer evidence.';
