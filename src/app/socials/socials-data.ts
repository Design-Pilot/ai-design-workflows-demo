import type { FilterConfig } from '../../components/inbox-template/inbox-template';
import type { EmailRowProps } from '../../components/email-row/email-row';
import type { TagColor } from '../../components/tag-button/tag-button';
import { profile, sidebarSections } from '../inbox/inbox-data';

export { profile, sidebarSections };

export const filters: FilterConfig[] = [
  { id: 'mentions', label: 'Mentions' },
  { id: 'following', label: 'Following' },
];

const now = new Date();
const today = (hour: number, minute: number) => {
  const d = new Date(now);
  d.setHours(hour, minute, 0, 0);
  return d;
};
const thisYear = (month: number, day: number) => new Date(now.getFullYear(), month, day);
const pastYear = (year: number, month: number, day: number) => new Date(year, month, day);

export const socialsEmails: EmailRowProps[] = [
  {
    sender: 'LinkedIn',
    subject: 'Sarah Park and 14 others liked your post about design systems',
    preview:
      'Your post "Why design tokens are the foundation of scalable product design" is getting traction — 14 reactions and 6 reposts this week.',
    date: today(11, 28),
    isRead: false,
    showCount: true,
    count: 14,
    showCategory: true,
    category: { label: 'LinkedIn', color: 'blue' as TagColor },
  },
  {
    sender: 'Twitter / X',
    subject: 'You were mentioned in a thread by @rauchg',
    preview:
      '@rauchg mentioned you: "Great breakdown of component API design by @chethankvs — this is exactly the kind of thinking that separates good systems from great ones."',
    date: today(10, 44),
    isRead: false,
    showCategory: true,
    category: { label: 'Mention', color: 'green' as TagColor },
  },
  {
    sender: 'Dribbble',
    subject: 'Your shot "Notion Mail — Email Row" hit 1k views',
    preview:
      'Milestone: "Notion Mail — Email Row" just crossed 1,000 views. It has 87 likes and 12 saves. See who is following your work.',
    date: today(9, 15),
    isRead: false,
    showTrailingAssets: true,
    labels: [{ label: 'Milestone', color: 'yellow' as TagColor }],
  },
  {
    sender: 'LinkedIn',
    subject: 'Marcus Webb sent you a connection request',
    preview:
      'Marcus Webb (Principal Designer at Stripe) wants to connect. You have 12 mutual connections including Amy Lin and Tom Nguyen.',
    date: today(8, 3),
    isRead: false,
    showCategory: true,
    category: { label: 'Connection', color: 'blue' as TagColor },
  },
  {
    sender: 'Product Hunt',
    subject: 'Your product "Notion Mail Components" is trending — #4 today',
    preview:
      'You are ranked #4 on Product Hunt today with 312 upvotes. 18 people left reviews. Check your dashboard for user comments.',
    date: today(7, 30),
    isRead: false,
    showCount: true,
    count: 18,
  },
  {
    sender: 'Twitter / X',
    subject: 'New followers this week: @joshwcomeau, @_alexanderpetros, and 9 more',
    preview:
      '11 people followed you this week including Josh Comeau and Alexander Petros. Your impressions are up 34% from last week.',
    date: thisYear(3, 14),
    isRead: false,
    showCount: true,
    count: 11,
  },
  {
    sender: 'Behance',
    subject: 'Someone appreciated your project: "Design System Foundations"',
    preview:
      'Aiko Tanaka and 6 others appreciated your Behance project. Your profile views are up 22% this month — keep the momentum going.',
    date: thisYear(3, 13),
    isRead: false,
    showCategory: true,
    category: { label: 'Behance', color: 'brown' as TagColor },
  },
  {
    sender: 'LinkedIn',
    subject: 'You appeared in 34 searches this week — recruiters are looking',
    preview:
      'Recruiters from Vercel, Stripe, and Linear viewed your profile. Your profile strength is All-Star. See who is interested.',
    date: thisYear(3, 12),
    isRead: true,
    showCategory: true,
    category: { label: 'LinkedIn', color: 'blue' as TagColor },
  },
  {
    sender: 'GitHub',
    subject: 'figma-workflows-tutorial starred by 8 new people',
    preview:
      'Your repository figma-workflows-tutorial now has 47 stars. 3 new forks this week. Someone opened an issue on the design token spec.',
    date: thisYear(3, 11),
    isRead: true,
    showCount: true,
    count: 8,
    showTrailingAssets: true,
    labels: [{ label: 'Open Source', color: 'green' as TagColor }],
  },
  {
    sender: 'Substack',
    subject: 'New post from The Design Systems Newsletter — "Tokens in 2025"',
    preview:
      'This week: how leading teams are adopting semantic token hierarchies, why multi-brand theming is harder than it looks, and three tools worth trying.',
    date: thisYear(3, 10),
    isRead: true,
    showCategory: true,
    category: { label: 'Newsletter', color: 'brown' as TagColor },
  },
  {
    sender: 'Dribbble',
    subject: 'Weekly digest — Design inspiration for you',
    preview:
      'Based on your saves: 12 new shots in Mobile UI, Dashboard Design, and Design Systems. Including work from Rauno Freiberg and Emil Kowalski.',
    date: thisYear(3, 8),
    isRead: true,
  },
  {
    sender: 'Twitter / X',
    subject: 'Your post got 47 retweets — "Design token naming conventions"',
    preview:
      'Your thread on semantic vs primitive token naming has 47 retweets and 280 likes. It is your most-engaged post in the last 90 days.',
    date: thisYear(3, 6),
    isRead: true,
    showCount: true,
    count: 47,
    showCategory: true,
    category: { label: 'Trending', color: 'yellow' as TagColor },
  },
  {
    sender: 'Product Hunt',
    subject: 'You are shortlisted for the Golden Kitty — Design Tools category',
    preview:
      'Voting is open for the 2025 Golden Kitty Awards. Your product is nominated in Design Tools. Share with your community to drive votes.',
    date: thisYear(2, 28),
    isRead: true,
    showTrailingAssets: true,
    labels: [
      { label: 'Award', color: 'yellow' as TagColor },
      { label: 'Nomination', color: 'green' as TagColor },
    ],
  },
  {
    sender: 'LinkedIn',
    subject: 'Your article on design systems got featured in UX Collective',
    preview:
      'UX Collective featured your article "Component API design for design systems" — it has been shared 200+ times across the platform.',
    date: thisYear(2, 21),
    isRead: true,
    showCategory: true,
    category: { label: 'Feature', color: 'green' as TagColor },
  },
  {
    sender: 'Behance',
    subject: 'Your project was selected for Behance Curated Gallery',
    preview:
      '"Notion Mail Components" was hand-picked by the Behance curation team for the Motion & UI gallery. Congrats — this reaches 2M+ monthly viewers.',
    date: thisYear(1, 15),
    isRead: true,
    showTrailingAssets: true,
    labels: [{ label: 'Curated', color: 'brown' as TagColor }],
  },
  {
    sender: 'GitHub',
    subject: 'New pull request on figma-workflows-tutorial from @lena-fischer',
    preview:
      'lena-fischer opened PR #31: "Add dark mode token mapping for elevated surfaces". 3 files changed, 42 additions. Review requested.',
    date: pastYear(2025, 11, 20),
    isRead: true,
    showCategory: true,
    category: { label: 'Open Source', color: 'green' as TagColor },
  },
];
