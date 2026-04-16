'use client';

import { useState } from 'react';
import { EmailRow } from '../components/email-row/email-row';
import type { TagColor } from '../components/tag-button/tag-button';
import { IconPaperclip, IconCalendar } from '../components/icons';

const PRESETS: Array<{
  label: string;
  examples: Array<{
    sender: string;
    senders?: string[];
    subject: string;
    preview: string;
    date: Date;
    isRead: boolean;
    showCategory?: boolean;
    category?: { label: string; color: TagColor };
    showCount?: boolean;
    count?: number;
    labels?: Array<{ label: string; color: TagColor }>;
    trailingIcon?: React.ReactNode;
    showTrailingAssets?: boolean;
  }>;
}> = [
  {
    label: 'Unread, no labels',
    examples: [
      {
        sender: 'Lena Fischer',
        subject: 'Re: Project Update',
        preview: "Here's the latest on the design system rollout and component library improvements we discussed in the strategy meeting",
        date: new Date(),
        isRead: false,
      },
      {
        sender: 'Sarah Chen',
        subject: 'Meeting notes from the quarterly planning session',
        preview: 'Quick sync debrief from this morning covering roadmap priorities, resource allocation, and upcoming deliverables',
        date: new Date(Date.now() - 3600000),
        isRead: false,
      },
      {
        sender: 'Alex Thompson',
        subject: 'Accepted: [Skool] Next Generation Builders Bi-Weekly Catchup @ Every 2 weeks from 10am to 11am on Saturday (GMT+1) (designpilot21@gmail.com)',
        preview: "Hey Team Design Pilot, We've just launched the affiliate program and are inviting a small number of creators to be the first partners.",
        date: new Date(Date.now() - 86400000),
        isRead: false,
      },
    ],
  },
  {
    label: 'Read, no labels',
    examples: [
      {
        sender: 'Notion Team',
        subject: 'Your weekly digest for March 3-9',
        preview: 'See what happened this week across your workspace including new pages, database updates, and team collaborations on active projects',
        date: new Date(Date.now() - 86400000 * 2),
        isRead: true,
      },
      {
        sender: 'Product Updates',
        subject: 'New features released - Component Library v2.0',
        preview: 'Check out what we shipped this week: new accessibility features, performance improvements, and enhanced dark mode support',
        date: new Date(Date.now() - 86400000 * 3),
        isRead: true,
      },
      {
        sender: 'Analytics Report',
        subject: 'Your monthly performance summary and growth metrics',
        preview: 'Here are your key metrics for March including user engagement, conversion rates, feature adoption, and recommendations for optimization',
        date: new Date(Date.now() - 86400000 * 7),
        isRead: true,
      },
    ],
  },
  {
    label: 'Unread, with category',
    examples: [
      {
        sender: 'GitHub',
        subject: 'PR review requested on figma-mcp/main - EmailRow component refactor',
        preview: 'Someone requested your review on figma-mcp/main for the latest updates to styling and accessibility improvements in components',
        date: new Date(Date.now() - 3600000 * 3),
        isRead: false,
        showCategory: true,
        category: { label: 'Work', color: 'blue' as TagColor },
      },
      {
        sender: 'Jira',
        subject: 'Issue assigned to you - PROJ-1234',
        preview: 'PROJ-1234: Update component library documentation with new accessibility guidelines and usage patterns for developers',
        date: new Date(Date.now() - 3600000 * 5),
        isRead: false,
        showCategory: true,
        category: { label: 'Engineering', color: 'green' as TagColor },
      },
      {
        sender: 'Linear',
        subject: 'New issues in your team - Action items for this sprint',
        preview: 'You have 3 new issues assigned this week covering bug fixes, feature improvements, and technical debt reduction in the platform',
        date: new Date(Date.now() - 86400000),
        isRead: false,
        showCategory: true,
        category: { label: 'Tasks', color: 'orange' as TagColor },
      },
    ],
  },
  {
    label: 'Unread, with count',
    examples: [
      {
        sender: 'YouTube',
        senders: ['YouTube', 'me'],
        subject: 'New messages in #design - Channel activity notification',
        preview: '2 new messages from your team members discussing the latest design system updates and component specifications',
        date: new Date(Date.now() - 3600000),
        isRead: false,
        showCount: true,
        count: 2,
      },
      {
        sender: 'YouTube',
        senders: ['YouTube', 'me', 'Alan'],
        subject: 'New messages in general - Community discussion ongoing',
        preview: '3 unread messages including announcements about upcoming events, feature discussions, and community feedback about the product',
        date: new Date(Date.now() - 7200000),
        isRead: false,
        showCount: true,
        count: 3,
      },
      {
        sender: 'YouTube',
        senders: ['CodeRabbit Newsletter', 'me', 'Alan', 'Sarah', 'Tom'],
        subject: 'Chat notifications - Multiple people replied to your message',
        preview: '5 people replied to your message in the engineering channel discussing implementation approaches and technical considerations',
        date: new Date(Date.now() - 10800000),
        isRead: false,
        showCount: true,
        count: 5,
      },
    ],
  },
  {
    label: 'With labels',
    examples: [
      {
        sender: 'Dropbox',
        subject: 'Q1 contract attached - please review before the deadline',
        preview: "Hey, I've attached the signed Q1 contract for your review. Please check the terms and confirm before end of week.",
        date: new Date(2025, 3, 6),
        isRead: true,
        showTrailingAssets: true,
        labels: [],
        trailingIcon: <IconPaperclip size={16} />,
      },
      {
        sender: 'Figma',
        subject: 'Your file was shared - Notion Mail design system',
        preview: 'Chethan shared "Notion Mail" with you for collaboration on the new email component library and design documentation',
        date: new Date(2025, 2, 15),
        isRead: true,
        showTrailingAssets: true,
        labels: [
          { label: 'Design', color: 'green' as TagColor },
          { label: 'Affiliate Collaboration', color: 'brown' as TagColor },
        ],
        trailingIcon: <IconPaperclip size={16} />,
      },
      {
        sender: 'Adobe',
        subject: 'Creative Cloud subscription update - New features available',
        preview: 'Your subscription includes 100GB of cloud storage, advanced design tools, and unlimited collaboration features for your team projects',
        date: new Date(2025, 1, 28),
        isRead: true,
        showTrailingAssets: true,
        labels: [
          { label: 'Admin', color: 'blue' as TagColor },
          { label: 'Billing', color: 'yellow' as TagColor },
        ],
      },
      {
        sender: 'Google Calendar',
        subject: 'Invitation: Quarterly review with leadership team',
        preview: 'You have been invited to a recurring quarterly review meeting scheduled for the first Monday of each month at 9:00 AM',
        date: new Date(2025, 2, 10),
        isRead: false,
        showTrailingAssets: true,
        labels: [{ label: 'Meeting', color: 'purple' as TagColor }],
        trailingIcon: <IconCalendar size={16} />,
      },
    ],
  },
  {
    label: 'Past year date',
    examples: [
      {
        sender: 'Apple',
        subject: 'Your receipt from Apple - Order confirmation and warranty information',
        preview: 'Thank you for your purchase. Your order includes one year limited warranty and access to technical support services.',
        date: new Date(2024, 11, 27),
        isRead: true,
      },
      {
        sender: 'Microsoft',
        subject: 'Order confirmation - Microsoft software license',
        preview: 'Order #12345 has been confirmed and is being prepared for shipment. You will receive a tracking number within 24 hours via email.',
        date: new Date(2024, 8, 12),
        isRead: true,
      },
      {
        sender: 'Google',
        subject: 'Your account activity - Security alert',
        preview: "We noticed a sign-in from a new location (San Francisco, CA) on your Google account. If this wasn't you, please review your security settings.",
        date: new Date(2024, 5, 3),
        isRead: true,
      },
    ],
  },
];

interface EmailRowPreviewProps {
  theme: 'light' | 'dark';
}

export function EmailRowPreview({ theme }: EmailRowPreviewProps) {
  const [activePreset, setActivePreset] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const preset = PRESETS[activePreset];

  const handlePresetChange = (index: number) => {
    setActivePreset(index);
    setSelectedRows(new Set());
  };

  const toggleSelected = (index: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Preset selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => handlePresetChange(i)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid var(--color-border-default)',
              background: i === activePreset ? 'var(--color-surface-selected)' : 'var(--color-surface-base)',
              color: 'var(--color-content-primary)',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Email list preview */}
      <div
        style={{
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid var(--color-border-default)',
        }}
      >
        {preset.examples.map((example, i) => (
          <EmailRow
            key={i}
            {...example}
            isSelected={selectedRows.has(i)}
            onSelect={() => toggleSelected(i)}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
