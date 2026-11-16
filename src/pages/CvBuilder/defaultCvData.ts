import { CvProfile } from '../../types';

export const ACCA_PAPERS_LIST = [
  // Foundations in Accountancy
  { code: 'FA1', name: 'Recording Financial Transactions', level: 'Foundation' },
  { code: 'MA1', name: 'Management Information', level: 'Foundation' },
  { code: 'FA2', name: 'Maintaining Financial Records', level: 'Foundation' },
  { code: 'MA2', name: 'Managing Costs and Finances', level: 'Foundation' },
  { code: 'FBT', name: 'Business and Technology (FIA)', level: 'Foundation' },
  { code: 'FMA', name: 'Management Accounting (FIA)', level: 'Foundation' },
  { code: 'FFA', name: 'Financial Accounting (FIA)', level: 'Foundation' },
  // Applied Knowledge
  { code: 'BT', name: 'Business and Technology', level: 'Applied Knowledge' },
  { code: 'MA', name: 'Management Accounting', level: 'Applied Knowledge' },
  { code: 'FA', name: 'Financial Accounting', level: 'Applied Knowledge' },
  // Applied Skills
  { code: 'LW', name: 'Corporate and Business Law', level: 'Applied Skills' },
  { code: 'PM', name: 'Performance Management', level: 'Applied Skills' },
  { code: 'TX', name: 'Taxation', level: 'Applied Skills' },
  { code: 'FR', name: 'Financial Reporting', level: 'Applied Skills' },
  { code: 'AA', name: 'Audit and Assurance', level: 'Applied Skills' },
  { code: 'FM', name: 'Financial Management', level: 'Applied Skills' },
  // Strategic Professional
  { code: 'SBL', name: 'Strategic Business Leader', level: 'Strategic Professional' },
  { code: 'SBR', name: 'Strategic Business Reporting', level: 'Strategic Professional' },
  { code: 'AFM', name: 'Advanced Financial Management', level: 'Strategic Professional' },
  { code: 'APM', name: 'Advanced Performance Management', level: 'Strategic Professional' },
  { code: 'ATX', name: 'Advanced Taxation', level: 'Strategic Professional' },
  { code: 'AAA', name: 'Advanced Audit and Assurance', level: 'Strategic Professional' },
];

export const COMMON_ACCOUNTING_SKILLS = [
  'IFRS & IAS Standards',
  'UK GAAP / US GAAP',
  'Double-Entry Bookkeeping',
  'Bank & GL Reconciliations',
  'Financial Statement Preparation',
  'Management Accounts',
  'Variance Analysis',
  'Budgeting & Forecasting',
  'Audit Working Papers',
  'Internal Controls Testing',
  'VAT & Sales Tax Filing',
  'Corporate Tax Computations',
  'Payroll Administration',
  'Advanced Excel (VLOOKUP, Pivot, INDEX/MATCH)',
  'Financial Modeling',
  'QuickBooks Online',
  'Xero Accounting',
  'SAP ERP / S/4HANA',
  'Sage 50cloud',
  'Power BI & Data Visualization',
];

export const SUMMARY_PRESETS = [
  {
    title: 'ACCA Part-Qualified / Trainee',
    text: 'Motivated ACCA Part-Qualified candidate with comprehensive knowledge of IFRS, double-entry bookkeeping, and financial statement preparation. Demonstrated capability in balance sheet reconciliations, VAT computations, and audit testing procedures. Seeking an Audit Trainee or Assistant Accountant position to deliver high-quality financial analysis while progressing toward full ACCA qualification.',
  },
  {
    title: 'ACCA Affiliate / Finalist',
    text: 'Results-driven ACCA Affiliate with extensive academic mastery across Strategic Business Reporting (SBR) and Financial Management. Experienced in preparing statutory accounts, monthly management reporting packs, and variance analysis under strict reporting deadlines. Adept with advanced Excel, ERP accounting platforms, and collaborative team communication.',
  },
  {
    title: 'Entry-Level / Accounting Graduate',
    text: 'High-achieving Accounting and Finance graduate and registered ACCA student. Solid theoretical foundation in financial reporting, corporate governance, and cost analysis. Detail-oriented and analytical, with proven skills in automated reconciliations, journal entries, and financial data modeling.',
  },
];

export const EMPTY_CV_PROFILE: CvProfile = {
  fullName: '',
  jobTitle: 'ACCA Student / Trainee Accountant',
  email: '',
  phone: '',
  location: '',
  linkedinUrl: '',
  websiteUrl: '',
  photoUrl: '',
  showPhoto: true,
  photoShape: 'rounded',
  summary: '',
  accaStatus: 'ACCA Student',
  accaRegistrationNumber: '',
  accaPassedPapers: [],
  epsmCompleted: false,
  perProgress: '',
  skills: [],
  experiences: [],
  education: [],
  certifications: [],
  languages: [{ id: 'lang-1', name: 'English', proficiency: 'Fluent' }],
  references: [{ id: 'ref-1', name: 'Professional references', role: 'Available Upon Request', company: '', emailOrPhone: '' }],
  theme: 'executive',
  accentColor: '#1E3A8A', // ACCA Navy Blue
};

export const SAMPLE_CV_PROFILE: CvProfile = {
  fullName: 'Alexander Wright',
  jobTitle: 'ACCA Part-Qualified | Trainee Accountant',
  email: 'alexander.wright@example.com',
  phone: '+44 7700 900123',
  location: 'London, United Kingdom',
  linkedinUrl: 'linkedin.com/in/alexanderwright-acca',
  websiteUrl: '',
  photoUrl: '',
  showPhoto: true,
  photoShape: 'rounded',
  summary:
    'Dedicated ACCA Part-Qualified professional (9/13 papers passed) with practical internship experience in financial reporting, bank reconciliations, and statutory audit procedures. Proficient in IFRS standards, double-entry bookkeeping, QuickBooks Online, and advanced Excel modeling. Detail-oriented and eager to contribute analytical diligence to a dynamic accounting practice or corporate finance team.',
  accaStatus: 'Part-Qualified (Applied Skills Completed)',
  accaRegistrationNumber: '3489215',
  accaPassedPapers: ['BT', 'MA', 'FA', 'LW', 'PM', 'TX', 'FR', 'AA', 'FM'],
  epsmCompleted: true,
  perProgress: '18 / 36 Months Completed',
  skills: [
    'IFRS & IAS Standards',
    'Double-Entry Bookkeeping',
    'Bank & GL Reconciliations',
    'Financial Statement Preparation',
    'Audit Working Papers',
    'VAT Filing & Computations',
    'Advanced Excel (VLOOKUP, Pivot, INDEX/MATCH)',
    'QuickBooks Online',
    'Xero Accounting',
    'Variance Analysis',
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Audit & Accounts Trainee',
      company: 'Premier Chartered Accountants LLP',
      location: 'London, UK',
      startDate: 'Oct 2024',
      endDate: 'Present',
      isCurrent: true,
      bulletPoints: [
        'Supported statutory audit engagements for SME commercial clients, performing walkthroughs and substantive tests of detail on revenue, payroll, and receivables.',
        'Prepared draft year-end financial statements in compliance with UK GAAP (FRS 102) and IFRS frameworks.',
        'Conducted detailed monthly bank, credit card, and intercompany reconciliations, investigating and clearing lingering variances.',
        'Drafted quarterly VAT returns and reconciled sales tax liability accounts against client HMRC ledgers.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Finance Assistant Intern',
      company: 'Crestline Advisory Services',
      location: 'Birmingham, UK',
      startDate: 'Jan 2024',
      endDate: 'Sep 2024',
      isCurrent: false,
      bulletPoints: [
        'Managed accounts payable workflow in QuickBooks Online, matching 300+ monthly purchase invoices against purchase orders and receipts.',
        'Assisted in the preparation of monthly management accounts packs and departmental expenditure variance reports.',
        'Maintained the fixed asset register, computing monthly depreciation schedules and recording additions/disposals.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'BSc (Hons) in Accounting and Finance',
      institution: 'University of Manchester',
      location: 'Manchester, UK',
      startYear: '2021',
      endYear: '2024',
      grade: 'First Class Honours (1st)',
      details: 'Awarded Academic Excellence Prize in Financial Reporting; exempt from ACCA Applied Knowledge papers.',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'ACCA Advanced Diploma in Accounting and Business',
      issuer: 'ACCA Global',
      year: '2024',
    },
    {
      id: 'cert-2',
      title: 'QuickBooks Certified ProAdvisor',
      issuer: 'Intuit',
      year: '2024',
    },
    {
      id: 'cert-3',
      title: 'Financial Modeling & Valuation Analyst (FMVA)',
      issuer: 'Corporate Finance Institute (CFI)',
      year: '2023',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'French', proficiency: 'Professional Working' },
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Professional references',
      role: 'Full references from audit managers and university faculty',
      company: '',
      emailOrPhone: 'Available upon request',
    },
  ],
  theme: 'executive',
  accentColor: '#1E3A8A', // ACCA Navy
};
