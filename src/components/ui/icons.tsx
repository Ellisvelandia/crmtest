import { memo } from 'react'
import {
  Loader2,
  Mail,
  User,
  Lock,
  LogOut,
  Settings,
  Plus,
  RotateCw,
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  BarChart3,
  Download,
  TrendingUp,
  Sparkles,
  Facebook,
  Menu,
  type LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

// Memoize icons for better performance
export const Icons = {
  // Dynamic icons are memoized to prevent unnecessary re-renders
  spinner: memo(Loader2),
  mail: memo(Mail),
  user: memo(User),
  lock: Lock,
  logout: memo(LogOut),
  settings: Settings,
  plus: memo(Plus),
  refresh: RotateCw,
  dashboard: memo(LayoutDashboard),
  projects: memo(FolderKanban),
  tasks: memo(ListTodo),
  reports: memo(BarChart3),
  download: memo(Download),
  trendingUp: memo(TrendingUp),
  sparkles: memo(Sparkles),
  facebook: memo(Facebook),
  menu: memo(Menu),
  
  // SVG icons are memoized components
  google: memo(({ ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
      viewBox="0 0 24 24" 
      width="24" 
      height="24" 
      {...props}
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )),

  zafiro: memo(({ ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )),
} 