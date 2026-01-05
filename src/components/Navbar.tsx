import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
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
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="hidden sm:inline">Temukan Desain Sejatimu</span>
        </div>
      </div>
    </nav>
  );
};
