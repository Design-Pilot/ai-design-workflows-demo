import type { FilterConfig } from '../../components/inbox-template/inbox-template';
import type { EmailRowProps } from '../../components/email-row/email-row';
import type { TagColor } from '../../components/tag-button/tag-button';
import { profile, sidebarSections } from '../inbox/inbox-data';

export { profile, sidebarSections };

export const filters: FilterConfig[] = [
  { id: 'deals', label: 'Deals' },
  { id: 'subscriptions', label: 'Subscriptions' },
];

const now = new Date();
const today = (hour: number, minute: number) => {
  const d = new Date(now);
  d.setHours(hour, minute, 0, 0);
  return d;
};
const thisYear = (month: number, day: number) => new Date(now.getFullYear(), month, day);
const pastYear = (year: number, month: number, day: number) => new Date(year, month, day);

export const promotionEmails: EmailRowProps[] = [
  {
    sender: 'Figma',
    subject: 'Your Figma Professional plan renews in 7 days',
    preview:
      'Your annual Professional plan ($144/year) renews on April 23. Update your payment method or switch plans before renewal.',
    date: today(10, 5),
    isRead: false,
    showCategory: true,
    category: { label: 'Billing', color: 'yellow' as TagColor },
  },
  {
    sender: 'Mobbin',
    subject: '50% off Pro — limited time offer for designers',
    preview:
      'Unlock the world\'s largest UI reference library. Browse 100,000+ screens from top apps. Offer expires Sunday.',
    date: today(8, 30),
    isRead: false,
    showTrailingAssets: true,
    labels: [{ label: 'Deal', color: 'green' as TagColor }],
  },
  {
    sender: 'Linear',
    subject: 'Upgrade to Linear Plus — now with advanced analytics',
    preview:
      'Linear Plus includes project insights, custom views, and priority support. Try it free for 14 days — no card required.',
    date: today(7, 15),
    isRead: false,
  },
  {
    sender: 'Dribbble',
    subject: 'Your Pro membership: 3 new perks added this month',
    preview:
      'Pro members now get access to the redesigned job board, expanded portfolio analytics, and exclusive design resources.',
    date: thisYear(3, 14),
    isRead: false,
    showCategory: true,
    category: { label: 'Membership', color: 'blue' as TagColor },
  },
  {
    sender: 'Notion',
    subject: 'Spring sale — 30% off Notion AI for your workspace',
    preview:
      'For a limited time, get Notion AI at 30% off. Generate docs, summarize notes, and automate workflows — all in one place.',
    date: thisYear(3, 12),
    isRead: false,
    showTrailingAssets: true,
    labels: [{ label: 'Deal', color: 'green' as TagColor }],
  },
  {
    sender: 'Adobe',
    subject: 'Exclusive offer: Adobe Creative Cloud at $29.99/mo',
    preview:
      'Switch from annual to monthly billing and save. Includes Photoshop, Illustrator, After Effects, and 100GB cloud storage.',
    date: thisYear(3, 10),
    isRead: true,
    showCategory: true,
    category: { label: 'Billing', color: 'yellow' as TagColor },
  },
  {
    sender: 'Spline',
    subject: 'Spline Pro is here — 3D design for product teams',
    preview:
      'Build interactive 3D experiences and export directly to your app or website. Spline Pro is now $12/mo — introducing team collaboration.',
    date: thisYear(3, 8),
    isRead: true,
  },
  {
    sender: 'Lottie Files',
    subject: 'Your free trial ends in 2 days — upgrade to keep access',
    preview:
      'Your LottieFiles Pro trial expires April 18. Keep unlimited animation exports, editor access, and team sharing by upgrading now.',
    date: thisYear(3, 6),
    isRead: true,
    showCategory: true,
    category: { label: 'Subscription', color: 'brown' as TagColor },
  },
  {
    sender: 'Maze',
    subject: 'Get more user insights — upgrade your Maze plan',
    preview:
      'Your current plan limits you to 3 studies/month. Upgrade to Starter and run unlimited usability tests with live participant panels.',
    date: thisYear(3, 4),
    isRead: true,
  },
  {
    sender: 'Framer',
    subject: 'You\'re on Framer Free — here\'s what you\'re missing',
    preview:
      'Framer Pro unlocks custom domains, password protection, CMS collections, and advanced interactions. Now $15/mo billed annually.',
    date: thisYear(2, 28),
    isRead: true,
    showTrailingAssets: true,
    labels: [{ label: 'Upgrade', color: 'blue' as TagColor }],
  },
  {
    sender: 'Pitch',
    subject: 'Pitch Pro — collaborate on decks with your design team',
    preview:
      'Pitch Pro is now $8/member/month. Get custom fonts, advanced analytics, password protection, and priority support.',
    date: thisYear(2, 21),
    isRead: true,
  },
  {
    sender: 'Rive',
    subject: 'Rive Team plan — animate together, ship faster',
    preview:
      'Collaborate on interactive animations with your product team. Rive Team is now available at $40/editor/month.',
    date: thisYear(1, 15),
    isRead: true,
    showCategory: true,
    category: { label: 'Subscription', color: 'brown' as TagColor },
  },
  {
    sender: 'Principle',
    subject: 'Principle for Mac — version 7 now available',
    preview:
      'Principle 7 brings variable fonts, improved Auto Layout support, and smoother prototyping exports. Update now — free for existing users.',
    date: pastYear(2025, 11, 18),
    isRead: true,
  },
];
