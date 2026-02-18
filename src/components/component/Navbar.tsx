"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MessageSquare, LogOut } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-foreground hover:opacity-80 transition-opacity"
        >
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Mystery Message</span>
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {session.user?.username || session.user?.email}
              </span>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
                size="sm"
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
