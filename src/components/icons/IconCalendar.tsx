interface IconProps {
  className?: string;
  size?: number;
}

export function IconCalendar({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="13" r="1" fill="currentColor"/>
      <circle cx="12" cy="13" r="1" fill="currentColor"/>
      <circle cx="16" cy="13" r="1" fill="currentColor"/>
      <circle cx="8" cy="17" r="1" fill="currentColor"/>
      <circle cx="12" cy="17" r="1" fill="currentColor"/>
    </svg>
  );
}
