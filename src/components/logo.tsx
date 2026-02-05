import { cn } from "@/lib/utils"

export function KostFlowLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
    >
      {/* Atap Rumah */}
      <path
        d="M3 10L12 3L21 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Simbol Flow / Circular Arrow */}
      <path
        d="M9 14C9 14 10.5 12.5 12 12.5C13.5 12.5 15 14 15 14C15 14 13.5 15.5 12 15.5C10.5 15.5 9 14 9 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21V12.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M7 21H17"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}