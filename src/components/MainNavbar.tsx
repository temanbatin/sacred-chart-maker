import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, User, BookOpen, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const MainNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/favicon.png" 
              alt="Teman Batin Logo" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-lg font-semibold text-foreground">
              Teman Batin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/#calculator" 
              className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              Get Your Chart
            </Link>

            <Link 
              to="/learn" 
              className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4" />
              Learn
            </Link>

            <Link 
              to="/reports" 
              className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
            >
              <FileText className="w-4 h-4" />
              Reports
            </Link>

            {/* About Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1 outline-none">
                About
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border">
                <DropdownMenuItem asChild>
                  <Link to="/tentang-kami" className="cursor-pointer">Our Story</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/methodology" className="cursor-pointer">Methodology</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Account Button */}
            <Button variant="outline" size="sm" asChild className="border-primary/50 hover:border-primary">
              <Link to="/account" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Account
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-up">
            <div className="flex flex-col gap-4">
              <Link 
                to="/#calculator" 
                className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4" />
                Get Your Chart
              </Link>
              <Link 
                to="/learn" 
                className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                Learn
              </Link>
              <Link 
                to="/reports" 
                className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                Reports
              </Link>
              <Link 
                to="/tentang-kami" 
                className="text-sm text-muted-foreground hover:text-accent transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Story
              </Link>
              <Link 
                to="/methodology" 
                className="text-sm text-muted-foreground hover:text-accent transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Methodology
              </Link>
              <Link 
                to="/account" 
                className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                My Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
