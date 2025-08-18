
import React from 'react';

const RadioIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M7 16h.01M12 16h.01M17 16h.01M12 8v-2M9 6h6" />
    <path d="m18 6 2-4" />
    <path d="m6 6-2-4" />
  </svg>
);

export default RadioIcon;
