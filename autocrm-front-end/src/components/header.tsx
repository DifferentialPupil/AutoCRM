"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/lib/store";

export function Header() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { searchQuery, setSearchQuery } = useSearchStore();

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // skip if search query is empty
    if (query.trim() === "") {
        if (searchQuery.trim() !== "") {
            setSearchQuery("");
        }
        return;
    }
    console.log("search", query);
    setSearchQuery(query);
  };

  const getUserInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="border-b">
        <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
            {/* Title */}
            <h1 className="text-xl font-semibold"></h1>

            {/* Search */}
            <form 
            onSubmit={handleSearch}
            className="max-w-md w-full mx-12"
            >
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                className="w-full"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full px-3"
              >
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>

            {/* User Menu */}
            <div className="flex items-center gap-4">
                {userEmail && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar>
                        <AvatarFallback>
                            {getUserInitials(userEmail)}
                        </AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Account</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userEmail}
                        </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                        Sign out
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                )}
            </div>
        </div>
      </div>
    </header>
  );
}