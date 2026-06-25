"use client";

import Link from 'next/link';
import { Briefcase, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { SignOutButton } from './sign-out-button';
import { useSession } from '@/lib/auth/auth-client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean | null>(false);
  const { data: session } = useSession();

  const isAuthorized = session?.user;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a3d52]"
      style={{ background: 'rgba(16,21,28,0.92)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href={'/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4a6c8f, #d9a441)' }}>
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">
              Career<span style={{ color: '#d9a441' }}>Path</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          
            {isAuthorized ?
              <div className="flex items-center gap-4">
                <Link href={'/dashboard'}>
                  <Button variant={"ghost"}
                    className={"text-white font-semibold"}
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className={"cursor-pointer relative h-9 w-9 rounded-full"}>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-white text-lg font-bold">
                        {session.user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuGroup className={"p-2"}>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm text-white/80 font-medium leading-none">
                            {session.user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>

                      <SignOutButton />
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> :
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-sm text-[#7a90a4] hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm text-[#7a90a4] hover:text-white transition-colors">How it works</a>
                <Link
                  href="/login"
                  className="text-sm text-[#7a90a4] hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: '#d9a441', color: '#10151c' }}
                >
                  Get Started
                </Link>
              </div>
            }

          {!isAuthorized && (
            <Button
              className="md:hidden text-[#7a90a4] hover:text-white"
              variant={"ghost"}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-5" />}
            </Button>
          )}
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#2a3d52] overflow-hidden rounded-lg"
              style={{ background: '#10151c' }}
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                <a href="#features" className="text-sm text-[#7a90a4] hover:text-white py-2" onClick={() => setMobileOpen(false)}>Features</a>
                <a href="#how-it-works" className="text-sm text-[#7a90a4] hover:text-white py-2" onClick={() => setMobileOpen(false)}>How it works</a>
                <Link href="/login" className="text-sm text-[#7a90a4] hover:text-white py-2" onClick={() => setMobileOpen(false)}>Sign in</Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-center"
                  style={{ background: '#d9a441', color: '#10151c' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  )
}

export default Navbar;