interface IconProps {
  className?: string;
  size?: number;
}

export function IconBookmark({ className, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.5 2H11.5C11.7761 2 12 2.22386 12 2.5V14.5L8 11.5L4 14.5V2.5C4 2.22386 4.22386 2 4.5 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
