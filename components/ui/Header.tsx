import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from './button';
import { LogOut, Upload, FileText, User } from 'lucide-react';

export function Header() {
  const user = useUser();
  const pathname = usePathname();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (path: string) => pathname === path;

  if (!user) {
    return (
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <div className="font-semibold text-xl flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1 rounded">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Link href="/">Trusted</Link>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <div className="font-semibold text-xl flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1 rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12L11 14L15 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Link href="/">Trusted</Link>
        </div>
        
        <nav className="ml-8 hidden md:flex items-center gap-6">
          <Link 
            href="/upload" 
            className={`flex items-center gap-2 ${isActive('/upload') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Upload className="w-4 h-4" />
            Upload Contract
          </Link>
          <Link 
            href="/review-summary" 
            className={`flex items-center gap-2 ${isActive('/review-summary') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <FileText className="w-4 h-4" />
            Review Summary
          </Link>
          <Link 
            href="/intake" 
            className={`flex items-center gap-2 ${isActive('/intake') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  );
} 