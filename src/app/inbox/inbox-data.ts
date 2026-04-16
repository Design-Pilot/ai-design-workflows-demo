import type { NavSection, SidebarProfile } from '../../components/sidebar/sidebar';
import type { FilterConfig } from '../../components/inbox-template/inbox-template';
import type { EmailRowProps } from '../../components/email-row/email-row';
import type { TagColor } from '../../components/tag-button/tag-button';

export const profile: SidebarProfile = {
  name: 'Chethan KVS',
  email: 'designpilot21@gmail.com',
};

export const sidebarSections: NavSection[] = [
  {
    id: 'views',
    title: 'Views',
    items: [
      { id: 'inbox', label: 'Inbox', count: 99, href: '/inbox' },
      { id: 'promotion', label: 'Promotion', count: 13, href: '/promotions' },
      { id: 'labels', label: 'Labels' },
      { id: 'social', label: 'Social', count: 83, href: '/socials' },
    ],
  },
  {
    id: 'mail',
    title: 'Mail',
    items: [
      { id: 'all-mail', label: 'All mail' },
      { id: 'sent', label: 'Sent' },
      { id: 'drafts', label: 'Drafts' },
      { id: 'spam', label: 'Spam' },
      { id: 'trash', label: 'Trash' },
    ],
  },
  {
    id: 'notion-apps',
    title: 'Notion apps',
    items: [
      { id: 'notion', label: 'Notion' },
      { id: 'notion-calendar', label: 'Notion Calendar' },
    ],
  },
  {
    id: 'footer',
    items: [
      { id: 'settings', label: 'Settings' },
      { id: 'support', label: 'Support & feedback' },
      { id: 'macos-app', label: 'Get macOS app' },
    ],
  },
];

export const filters: FilterConfig[] = [
  { id: 'categories', label: 'Categories' },
  { id: 'labels', label: 'Labels' },
];

// Hand-authored inbox: mixes unread/read, categories, labels, counts, and all three
// date formats (today/this-year/past-year) so designers branching the repo see a
// representative starting point.
const now = new Date();
const today = (hour: number, minute: number) => {
  const d = new Date(now);
  d.setHours(hour, minute, 0, 0);
  return d;
};
const thisYear = (month: number, day: number) => new Date(now.getFullYear(), month, day);
const pastYear = (year: number, month: number, day: number) => new Date(year, month, day);

export const inboxEmails: EmailRowProps[] = [
  {
    sender: 'Lena Fischer',
    subject: 'Re: Project Update',
    preview:
      "Here's the latest on the design system rollout and component library improvements we discussed in the strategy meeting",
    date: today(9, 42),
    isRead: false,
  },
  {
    sender: 'GitHub',
    subject: 'PR review requested on figma-mcp/main — EmailRow component refactor',
    preview:
      'Someone requested your review on figma-mcp/main for the latest updates to styling and accessibility improvements',
    date: today(8, 15),
    isRead: false,
    showCategory: true,
    category: { label: 'Work', color: 'blue' as TagColor },
  },
  {
    sender: 'Figma',
    subject: 'Your file was shared — Notion Mail design system',
    preview:
      'Chethan shared "Notion Mail" with you for collaboration on the new email component library and documentation',
    date: today(7, 3),
    isRead: false,
    showTrailingAssets: true,
    labels: [
      { label: 'Design', color: 'green' as TagColor },
      { label: 'Collaboration', color: 'brown' as TagColor },
    ],
  },
  {
    sender: 'Slack',
    senders: ['Figma', 'Sarah Chen', 'Alex Thompson'],
    subject: 'New messages in #design — Channel activity',
    preview:
      '3 new messages from your team members discussing the latest design system updates and component specifications',
    date: thisYear(3, 14),
    isRead: false,
    showCount: true,
    count: 3,
  },
  {
    sender: 'Linear',
    subject: 'Issue assigned to you — PROJ-1234',
    preview:
      'PROJ-1234: Update component library documentation with new accessibility guidelines and usage patterns',
    date: thisYear(3, 12),
    isRead: false,
    showCategory: true,
    category: { label: 'Engineering', color: 'green' as TagColor },
  },
  {
    sender: 'Sarah Chen',
    subject: 'Meeting notes from the quarterly planning session',
    preview:
      'Quick sync debrief from this morning covering roadmap priorities, resource allocation, and upcoming deliverables',
    date: thisYear(3, 10),
    isRead: true,
  },
  {
    sender: 'Dropbox',
    subject: 'Q1 contract attached — please review before the deadline',
    preview:
      "Hey, I've attached the signed Q1 contract for your review. Please check the terms and confirm before end of week.",
    date: thisYear(3, 8),
    isRead: true,
    showTrailingAssets: true,
    labels: [],
  },
  {
    sender: 'Notion Team',
    subject: 'Your weekly digest for April 6-12',
    preview:
      'See what happened this week across your workspace including new pages, database updates, and team collaborations',
    date: thisYear(3, 6),
    isRead: true,
  },
  {
    sender: 'Google Calendar',
    subject: 'Invitation: Quarterly review with leadership team',
    preview:
      'You have been invited to a recurring quarterly review meeting scheduled for the first Monday of each month at 9:00 AM',
    date: thisYear(2, 28),
    isRead: true,
    showTrailingAssets: true,
    labels: [{ label: 'Meeting', color: 'yellow' as TagColor }],
  },
  {
    sender: 'Adobe',
    subject: 'Creative Cloud subscription update — New features available',
    preview:
      'Your subscription includes 100GB of cloud storage, advanced design tools, and unlimited collaboration features',
    date: thisYear(2, 21),
    isRead: true,
    showTrailingAssets: true,
    labels: [
      { label: 'Admin', color: 'blue' as TagColor },
      { label: 'Billing', color: 'yellow' as TagColor },
    ],
  },
  {
    sender: 'Product Updates',
    subject: 'New features released — Component Library v2.0',
    preview:
      'Check out what we shipped this week: new accessibility features, performance improvements, and enhanced dark mode support',
    date: thisYear(1, 15),
    isRead: true,
  },
  {
    sender: 'Analytics Report',
    subject: 'Your monthly performance summary and growth metrics',
    preview:
      'Here are your key metrics for March including user engagement, conversion rates, feature adoption, and recommendations',
    date: thisYear(1, 3),
    isRead: true,
  },
  {
    sender: 'Apple',
    subject: 'Your receipt from Apple — Order confirmation and warranty',
    preview:
      'Thank you for your purchase. Your order includes one year limited warranty and access to technical support services.',
    date: pastYear(2025, 11, 27),
    isRead: true,
  },
  {
    sender: 'Microsoft',
    subject: 'Order confirmation — Microsoft software license',
    preview:
      'Order #12345 has been confirmed. You will receive a tracking number within 24 hours via email.',
    date: pastYear(2025, 10, 12),
    isRead: true,
  },
  {
    sender: 'Google',
    subject: 'Your account activity — Security alert',
    preview:
      "We noticed a sign-in from a new location (San Francisco, CA) on your Google account. If this wasn't you, please review your security settings.",
    date: pastYear(2025, 8, 3),
    isRead: true,
  },
  {
    sender: 'LinkedIn',
    subject: 'You appeared in 12 searches this week',
    preview:
      'Recruiters from Stripe, Notion, and Figma viewed your profile. See who is interested in your work.',
    date: pastYear(2025, 6, 14),
    isRead: true,
  },
];
