export type PageKey =
  | 'dashboard'
  | 'schools'
  | 'schedule'
  | 'assignments'
  | 'capstone'
  | 'certificates'
  | 'enroll'
  | 'mygroup'
  | 'notifications'
  | 'settings'

export const PAGE_TITLES: Record<PageKey, string> = {
  dashboard: 'Overview',
  schools: 'My Schools',
  schedule: 'Weekly Schedule',
  assignments: 'Assignments',
  capstone: 'Capstone Projects',
  certificates: 'Certificates',
  enroll: 'Enroll in a School',
  mygroup: 'My Group',
  notifications: 'Notifications',
  settings: 'Settings',
}

export interface Task {
  id: number
  title: string
  desc: string
  school: string
  schoolLabel: string
  tagClass: string
  typeLabel: string
  typeIcon: string
  day: string
  dayOrder: number
  urgencyClass: string
  urgencyLabel: string
}

export const TASKS: Task[] = [
  { id: 1, title: 'Community policy solution — capstone submission', desc: 'Final capstone: problem definition, root cause analysis, policy solution, implementation plan, expected outcomes. Must be Edo South centered.', school: 'ppg', schoolLabel: 'Politics & Governance', tagClass: 'tag-blue', typeLabel: 'Group · Capstone', typeIcon: 'ti-users', day: 'Overdue', dayOrder: 0, urgencyClass: 'urgent', urgencyLabel: 'Overdue' },
  { id: 2, title: '2-minute community change speech', desc: 'Deliver a 2-minute speech on a change you want to see in your community. Builds on Day 3 leadership messaging and political communication.', school: 'ppg', schoolLabel: 'Politics & Governance', tagClass: 'tag-blue', typeLabel: 'Individual', typeIcon: 'ti-user', day: 'Overdue', dayOrder: 0, urgencyClass: 'urgent', urgencyLabel: 'Overdue' },
  { id: 3, title: 'Personal productivity plan — 1 week', desc: 'Create a 1-week personal productivity plan. Include how you handle pressure and responsibility as a leader. Part of Day 3 personal management skills.', school: 'lm', schoolLabel: 'Leadership & Management', tagClass: 'tag-teal', typeLabel: 'Individual · Wed', typeIcon: 'ti-user', day: 'Today', dayOrder: 1, urgencyClass: 'today', urgencyLabel: 'Due today' },
  { id: 4, title: 'Draft a leadership message to a team', desc: 'Write a leadership message you would send to a team you are leading. Ties into the communication skills and leadership messaging session.', school: 'lm', schoolLabel: 'Leadership & Management', tagClass: 'tag-teal', typeLabel: 'Individual · Wed', typeIcon: 'ti-user', day: 'Today', dayOrder: 1, urgencyClass: 'today', urgencyLabel: 'Due today' },
  { id: 5, title: 'Mini business plan draft', desc: "Write a simple mini business plan: what you sell, who you sell to, and how you make money. Improve your group's business idea from Tuesday.", school: 'be', schoolLabel: 'Business & Entrepreneurship', tagClass: 'tag-amber', typeLabel: 'Individual · Wed', typeIcon: 'ti-user', day: 'Tomorrow', dayOrder: 2, urgencyClass: 'upcoming', urgencyLabel: 'Tomorrow' },
  { id: 6, title: 'Group execution strategy document', desc: 'Develop a full solution to the leadership challenge from Tuesday. Assign clear responsibilities and create an execution timeline and plan.', school: 'lm', schoolLabel: 'Leadership & Management', tagClass: 'tag-teal', typeLabel: 'Group · Thu', typeIcon: 'ti-users', day: 'Tomorrow', dayOrder: 2, urgencyClass: 'upcoming', urgencyLabel: 'Tomorrow' },
  { id: 7, title: 'Group business model + marketing plan', desc: 'Finalize product/service design, create brand name and simple identity, develop marketing strategy, and plan how to attract your first customers.', school: 'be', schoolLabel: 'Business & Entrepreneurship', tagClass: 'tag-amber', typeLabel: 'Group · Thu', typeIcon: 'ti-users', day: 'This week', dayOrder: 3, urgencyClass: 'upcoming', urgencyLabel: 'Thu' },
  { id: 8, title: 'Leadership & management capstone project', desc: 'Final document: problem definition, leadership strategy, execution plan, team coordination model, and expected outcomes. Full group submission.', school: 'lm', schoolLabel: 'Leadership & Management', tagClass: 'tag-teal', typeLabel: 'Group · Fri', typeIcon: 'ti-users', day: 'This week', dayOrder: 3, urgencyClass: 'upcoming', urgencyLabel: 'Fri' },
  { id: 9, title: 'Business capstone project', desc: 'Full business project: idea, target market, business model, pricing strategy, marketing plan, and execution roadmap. Full group submission.', school: 'be', schoolLabel: 'Business & Entrepreneurship', tagClass: 'tag-amber', typeLabel: 'Group · Fri', typeIcon: 'ti-users', day: 'This week', dayOrder: 3, urgencyClass: 'upcoming', urgencyLabel: 'Fri' },
]

export const GROUP_MEMBERS = [
  { initials: 'EA', name: 'Emeka Ade', role: 'You', task: 'Marketing plan draft' },
  { initials: 'CO', name: 'Chiamaka Okoye', role: 'Member', task: 'Pricing strategy' },
  { initials: 'TI', name: 'Tega Ighodaro', role: 'Member', task: 'Target market research' },
  { initials: 'FU', name: 'Faith Uwagboe', role: 'Group lead', task: 'Coordinating capstone build' },
]

export const NOTIFICATIONS = [
  { icon: 'ti-alert-circle', bg: '#fde8e8', color: '#b42318', text: 'Capstone submission for Politics & Governance is overdue', time: '1 hour ago', unread: true },
  { icon: 'ti-clock', bg: '#faeeda', color: '#854f0b', text: 'Personal productivity plan due today — Leadership & Management', time: '3 hours ago', unread: true },
  { icon: 'ti-check', bg: '#e1f5ee', color: '#0f6e56', text: 'Leadership reflection sheet submitted', time: '2 hours ago', unread: false },
  { icon: 'ti-users', bg: '#faeeda', color: '#854f0b', text: 'Joined Group B — Business cohort', time: 'Yesterday', unread: false },
  { icon: 'ti-file-text', bg: '#e6f1fb', color: '#185fa5', text: 'Policy problem statement approved by facilitator', time: '2 days ago', unread: false },
  { icon: 'ti-certificate', bg: 'rgba(249,115,22,.1)', color: '#f97316', text: 'Certificate in Public Service — unlocked', time: '3 days ago', unread: false },
]

export const ENROLL_SCHOOLS = [
  { id: 'ppg', icon: 'ti-building-community', bg: '#e6f1fb', color: '#185fa5', label: 'Politics, Policy & Governance', sub: 'Civic responsibility · Policy design' },
  { id: 'lm', icon: 'ti-users', bg: '#e1f5ee', color: '#0f6e56', label: 'Leadership & Management', sub: 'Team dynamics · Strategic execution' },
  { id: 'be', icon: 'ti-briefcase', bg: '#faeeda', color: '#854f0b', label: 'Business & Entrepreneurship', sub: 'Idea to launch · Business planning' },
  { id: 'ps', icon: 'ti-landmark', bg: '#f0eaff', color: '#6d28d9', label: 'Public Service', sub: 'Civic delivery · Stakeholder mapping' },
  { id: 'td', icon: 'ti-devices', bg: '#e0e7ff', color: '#3730a3', label: 'Technology & Digital Skills', sub: 'Digital marketing · Cybersecurity' },
  { id: 'ai', icon: 'ti-brain', bg: '#fce7f3', color: '#831843', label: 'AI & Machine Learning', sub: 'AI tools · ML project development' },
]