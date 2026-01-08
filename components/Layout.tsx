import React from 'react';
import { Home, Trophy, Swords, User, Zap, Users, LayoutGrid } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

// Direct re-exports to ensure modules are loaded correctly
export { Link, useLocation, useNavigate, useParams };

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
        isActive(to) ? 'text-neon-purple' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      <Icon size={22} strokeWidth={isActive(to) ? 2.5 : 2} />
      <span className="text-[9px] uppercase font-bold tracking-wider">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-neon-purple selection:text-white pb-20 md:pb-0 md:pl-20">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center border-r border-gray-800 bg-card z-50 py-8">
        <div className="mb-8">
            <Zap className="text-neon-purple" size={32} />
        </div>
        <nav className="flex flex-col space-y-8 w-full">
            <NavItem to="/app/home" icon={Home} label="Base" />
            <NavItem to="/app/challenges" icon={Swords} label="Play" />
            <NavItem to="/app/nexus" icon={LayoutGrid} label="Nexus" />
            <NavItem to="/app/friends" icon={Users} label="Squad" />
            <NavItem to="/app/ranking" icon={Trophy} label="Rank" />
            <NavItem to="/app/profile" icon={User} label="Perfil" />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="w-full max-w-lg mx-auto md:max-w-2xl lg:max-w-4xl min-h-screen p-4 md:p-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-card/90 backdrop-blur-md border-t border-gray-800 flex justify-around items-center z-50 pb-safe px-2">
        <NavItem to="/app/home" icon={Home} label="Base" />
        <NavItem to="/app/challenges" icon={Swords} label="War" />
        <NavItem to="/app/nexus" icon={LayoutGrid} label="Nexus" />
        <NavItem to="/app/friends" icon={Users} label="Squad" />
        <NavItem to="/app/profile" icon={User} label="Perfil" />
      </nav>
    </div>
  );
};

export default Layout;