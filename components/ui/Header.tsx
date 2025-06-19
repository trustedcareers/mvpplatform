import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserContext } from '@/lib/hooks/useUserContext';
import { Button } from './button';
import { Avatar, AvatarFallback } from './avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

export function Header() {
  const pathname = usePathname();
  const { user, profile } = useUserContext();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary text-white p-1 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold">Trusted App</span>
            </Link>
          </div>

          {user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/upload"
                className={`flex items-center gap-2 ${
                  isActive('/upload')
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Upload Contract
              </Link>
              <Link
                href="/review-summary"
                className={`flex items-center gap-2 ${
                  isActive('/review-summary')
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Review Summary
              </Link>
              <Link
                href="/intake"
                className={`flex items-center gap-2 ${
                  isActive('/intake')
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {profile?.full_name
                          ? getInitials(profile.full_name)
                          : user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/intake">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <form action="/auth/signout" method="post" className="w-full">
                      <button type="submit" className="w-full text-left">
                        Sign Out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 