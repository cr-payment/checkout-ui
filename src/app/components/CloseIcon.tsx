import { ReactElement } from "react";

export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  width?: number;
  height?: number;
  opacity?: number;
}

export function CloseIcon(props: IconProps): ReactElement<IconProps> {
  return (
    <svg fill="none" height="15" viewBox="0 0 14 15" width="14" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13.6743 0.442879C13.2399 0.00862377 12.5358 0.00862377 12.1014 0.442879L7 5.54428L1.8986 0.442879C1.46422 0.00862377 0.760077 0.00862377 0.325691 0.442879C-0.108564 0.877265 -0.108564 1.5814 0.325691 2.01579L5.42709 7.11719L0.325691 12.2186C-0.108564 12.653 -0.108564 13.3571 0.325691 13.7915C0.760077 14.2258 1.46422 14.2258 1.8986 13.7915L7 8.6901L12.1014 13.7915C12.5358 14.2258 13.2399 14.2258 13.6743 13.7915C14.1086 13.3571 14.1086 12.653 13.6743 12.2186L8.57291 7.11719L13.6743 2.01579C14.1086 1.5814 14.1086 0.877265 13.6743 0.442879Z"
        fill="currentColor"
      />
    </svg>
  );
}
