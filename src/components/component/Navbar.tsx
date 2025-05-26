"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 sm:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col text-center sm:flex-row justify-between align-middle">
        <Link href="/" className="text-xl font-bold">
          True Feedback
        </Link>
        {session ? (
          <>
            <span className="mr-4 mb-2 sm:mb-0">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full md:w-auto bg-slate-200 hover:bg-slate-300 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-200 hover:bg-slate-300 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
