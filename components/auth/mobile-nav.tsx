"use client";

import Link from "next/link";
import { LogOut, MessageCircle } from "lucide-react";
import { useSession } from "@/lib/contexts/session-context";

interface NavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  navItems: NavItem[];
  onLinkClick: () => void;
}

export default function MobileNav({ navItems, onLinkClick }: MobileNavProps) {
  const { isAuthenticated, logout } = useSession();

  const handleLogout = () => {
    logout();
    onLinkClick();
  };

  return (
    <nav className="md:hidden border-t border-primary/10">
      <div className="py-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-md transition-colors"
            onClick={onLinkClick}
          >
            {item.label}
          </Link>
        ))}
        {isAuthenticated && (
          <>
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-md transition-colors"
              onClick={onLinkClick}
            >
              <MessageCircle className="h-4 w-4 mr-3" />
              Start Chat
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-md transition-colors flex items-center"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
