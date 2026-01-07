import React, { useState, useEffect, createContext, useContext } from 'react';
import { Home, Trophy, Swords, User, Zap, ShoppingBag, Users } from 'lucide-react';

// --- CUSTOM ROUTER IMPLEMENTATION ---
// Since react-router-dom is not available in this environment, we implement a lightweight HashRouter.

const RouterContext = createContext<{ route: string; navigate: (path: string | number, options?: { replace?: boolean }) => void } | null>(null);

export const HashRouter = ({ children }: { children: React.ReactNode }) => {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/login');

  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash.slice(1) || '/login');
    };
    window.addEventListener('hashchange', onHashChange);
    // Ensure hash exists
    if (!window.location.hash) window.location.hash = '#/login';
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
        window.history.go(to);
        return;
    }
    if (options?.replace) {
        window.location.replace('#' + to);
    } else {
        window.location.hash = to;
    }
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useNavigate = () => {
    const context = useContext(RouterContext);
    return context ? context.navigate : () => {};
};

export const useLocation = () => {
    const context = useContext(RouterContext);
    return { pathname: context?.route || '/' };
};

export const useParams = () => {
    const { pathname } = useLocation();
    const parts = pathname.split('/');
    // Specific handler for challenges/:id
    // Path structure: /app/challenges/123
    if (pathname.includes('/challenges/') && parts.length >= 4) {
        return { id: parts[3] };
    }
    return {};
};

export const Link = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <a 
      href={`#${to}`} 
      className={className}
      onClick={(e) => {
        // Prevent default only if we wanted to handle history pushstate, but for hash router default anchor behavior is fine
        // provided we write the href as #path.
      }}
    >
      {children}
    </a>
);

export const Navigate = ({ to, replace }: { to: string; replace?: boolean }) => {
    const navigate = useNavigate();
    useEffect(() => { navigate(to, { replace }); }, [to, replace, navigate]);
    return null;
};

export const Routes = ({ children }: { children: React.ReactNode }) => {
    const { pathname } = useLocation();
    let element: React.ReactNode = null;
    
    React.Children.forEach(children, (child) => {
        if (element) return; // Match first
        if (React.isValidElement(child)) {
            const { path, element: routeElement } = child.props as { path: string; element: React.ReactNode };
            
            // Catch-all
            if (path === '*') {
                element = routeElement;
                return;
            }

            // Exact match
            if (path === pathname) {
                element = routeElement;
                return;
            }

            // Param match (e.g., /app/challenges/:id)
            if (path && path.includes(':')) {
                const regexStr = '^' + path.replace(/:[^\s/]+/g, '([^/]+)') + '$';
                const regex = new RegExp(regexStr);
                if (regex.test(pathname)) {
                    element = routeElement;
                }
            }
        }
    });
    return <>{element}</>;
};

export const Route = ({ path, element }: { path: string; element: React.ReactNode }) => element;

// --- END CUSTOM ROUTER ---

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
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center border-r border-gray-800 bg-card z-50 py-8">
        <div className="mb-8">
            <Zap className="text-neon-purple" size={32} />
        </div>
        <nav className="flex flex-col space-y-8 w-full">
            <NavItem to="/app/home" icon={Home} label="Base" />
            <NavItem to="/app/challenges" icon={Swords} label="Play" />
            <NavItem to="/app/friends" icon={Users} label="Squad" />
            <NavItem to="/app/ranking" icon={Trophy} label="Rank" />
            <NavItem to="/app/shop" icon={ShoppingBag} label="Loja" />
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
        <NavItem to="/app/shop" icon={ShoppingBag} label="Loja" />
        <NavItem to="/app/friends" icon={Users} label="Squad" />
        <NavItem to="/app/profile" icon={User} label="Perfil" />
      </nav>
    </div>
  );
};

export default Layout;