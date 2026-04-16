'use client';

import { TagButton, type TagColor } from '../tag-button/tag-button';
import { IconButton } from '../icon-button/icon-button';
import { IconStar, IconArchive, IconTrash, IconClock, IconUnread } from '../icons';
import { Checkbox } from '../checkbox/checkbox';
import { formatDate } from './utils';
import styles from './email-row.module.css';

function formatSenders(senders: string[]): { prefix: string; suffix?: string } {
  if (senders.length <= 3) {
    return { prefix: senders.join(', ') };
  }
  // 4+ senders: prefix can truncate, suffix (.. LastName) always visible
  return {
    prefix: `${senders[0]}, ${senders[1]}`,
    suffix: `.. ${senders[senders.length - 1]}`,
  };
}

export interface EmailRowProps {
  sender: string;
  senders?: string[];
  subject: string;
  preview: string;
  date: Date;
  isRead?: boolean;
  isSelected?: boolean;
  showCount?: boolean;
  count?: number;
  showCategory?: boolean;
  category?: { label: string; color: TagColor };
  labels?: Array<{ label: string; color: TagColor }>;
  trailingIcon?: React.ReactNode;
  showTrailingAssets?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
}

export function EmailRow({
  sender,
  senders,
  subject,
  preview,
  date,
  isRead = false,
  isSelected = false,
  showCount = false,
  count,
  showCategory = false,
  category,
  labels = [],
  trailingIcon,
  showTrailingAssets = true,
  onSelect,
  onClick,
}: EmailRowProps) {
  const rootClass = [
    styles.root,
    isRead ? styles.read : '',
    isSelected ? styles.selected : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} onClick={onClick}>
      <div className={styles.container}>
        {/* Checkbox */}
        <div className={styles.checkboxContainer}>
          <Checkbox
            checked={isSelected}
            onChange={onSelect}
          />
        </div>

        {/* Main content */}
        <div className={styles.content}>
          {/* Unread indicator */}
          <div className={styles.unreadIndicator}>
            <div className={`${styles.unreadDot} ${isRead ? styles.unreadDotHidden : ''}`} />
          </div>

          {/* Message details */}
          <div className={styles.messageDetails}>
            {/* Sender info */}
            <div className={styles.senderInfo}>
              {showCategory && category && (
                <TagButton label={category.label} color="neutral" />
              )}
              {(() => {
                const formatted = senders && senders.length > 0
                  ? formatSenders(senders)
                  : { prefix: sender };
                return formatted.suffix ? (
                  <span className={styles.senderNameGroup}>
                    <span className={styles.senderNamePrefix}>{formatted.prefix}</span>
                    <span className={styles.senderNameSuffix}>{formatted.suffix}</span>
                  </span>
                ) : (
                  <span className={styles.senderName}>{formatted.prefix}</span>
                );
              })()}
              {showCount && count !== undefined && (
                <span className={styles.count}>{count}</span>
              )}
            </div>

            {/* Message info */}
            <div className={styles.messageInfo}>
              <span className={styles.subject}>{subject}</span>
              <span className={styles.preview}>{preview}</span>
            </div>
          </div>
        </div>

        {/* Date / trailing */}
        <div className={styles.dateInfo}>
          {showTrailingAssets && (labels.length > 0 || trailingIcon) && (
            <div className={styles.labelsContainer}>
              {labels.map((l, i) => (
                <TagButton key={i} label={l.label} color={l.color} />
              ))}
              {trailingIcon && (
                <IconButton icon={trailingIcon} aria-label="action" />
              )}
            </div>
          )}
          <span className={styles.dateText}>{formatDate(date)}</span>
        </div>

        {/* Action bar (shown on hover via CSS) */}
        <div className={styles.actionBar}>
          <button className={styles.actionButton} type="button" aria-label="Star"><IconStar size={16} /></button>
          <button className={styles.actionButton} type="button" aria-label="Archive"><IconArchive size={16} /></button>
          <button className={styles.actionButton} type="button" aria-label="Delete"><IconTrash size={16} /></button>
          <button className={styles.actionButton} type="button" aria-label="Mark unread"><IconUnread size={16} /></button>
          <button className={styles.actionButton} type="button" aria-label="Snooze"><IconClock size={16} /></button>
        </div>
      </div>
    </div>
  );
}
