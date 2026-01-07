import React, { useState, useEffect, createContext, useContext } from 'react';
import { Home, Trophy, Swords, User, Zap, Users, LayoutGrid } from 'lucide-react';

// --- ROBUST ROUTER CONTEXTS ---
const RouterContext = createContext<{ 
    route: string; 
    navigate: (path: string | number, options?: { replace?: boolean }) => void 
} | null>(null);

const ParamsContext = createContext<Record<string, string>>({});

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-red-500 p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">SYSTEM FAILURE</h1>
            <div className="bg-gray-900 p-4 rounded text-xs font-mono text-left mb-4 w-full max-w-md overflow-auto">
                {this.state.error?.message}
            </div>
            <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-6 py-2 rounded font-bold"
            >
                REBOOT
            </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- ROUTER COMPONENTS ---

export const HashRouter = ({ children }: { children: React.ReactNode }) => {
  // Normalize hash: ensure it starts with /
  const getHashPath = () => {
    const hash = window.location.hash.slice(1);
    return hash.startsWith('/') ? hash : '/' + hash;
  };

  const [route, setRoute] = useState(getHashPath() || '/login');

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getHashPath());
    };
    window.addEventListener('hashchange', onHashChange);
    
    // Initial check
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
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </RouterContext.Provider>
  );
};

export const useNavigate = () => {
    const context = useContext(RouterContext);
    if (!context) return () => console.warn("useNavigate used outside Router");
    return context.navigate;
};

export const useLocation = () => {
    const context = useContext(RouterContext);
    return { pathname: context?.route || '/' };
};

export const useParams = () => {
    return useContext(ParamsContext);
};

export const Link = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
    const navigate = useNavigate();
    return (
        <a 
          href={`#${to}`} 
          className={className}
          onClick={(e) => {
            e.preventDefault();
            navigate(to);
          }}
        >
          {children}
        </a>
    );
};

export const Navigate = ({ to, replace }: { to: string; replace?: boolean }) => {
    const navigate = useNavigate();
    useEffect(() => {
        // Prevent infinite loops: only navigate if we aren't already there
        const currentHash = window.location.hash.slice(1);
        if (currentHash !== to) {
            navigate(to, { replace });
        }
    }, [to, replace, navigate]);
    return null;
};

// --- CORE ROUTING LOGIC ---

export const Routes = ({ children }: { children: React.ReactNode }) => {
    const { pathname } = useLocation();
    
    const routes = React.Children.toArray(children) as React.ReactElement[];
    
    for (const child of routes) {
        if (!React.isValidElement(child)) continue;
        
        const { path, element } = child.props as { path: string; element: React.ReactNode };
        
        // 1. Exact Match
        if (path === pathname) {
            return <>{element}</>;
        }

        // 2. Wildcard (e.g. /app/*)
        if (path.endsWith('/*')) {
            const base = path.slice(0, -2);
            if (pathname.startsWith(base)) {
                 return <>{element}</>;
            }
        }

        // 3. Catch-all (*)
        if (path === '*') {
             return <>{element}</>;
        }

        // 4. Parameter Match (e.g. /app/challenges/:id)
        if (path.includes(':')) {
            const pathSegments = path.split('/').filter(Boolean);
            const urlSegments = pathname.split('/').filter(Boolean);

            if (pathSegments.length === urlSegments.length) {
                const params: Record<string, string> = {};
                let isMatch = true;

                for (let i = 0; i < pathSegments.length; i++) {
                    if (pathSegments[i].startsWith(':')) {
                        const paramName = pathSegments[i].slice(1);
                        params[paramName] = urlSegments[i];
                    } else if (pathSegments[i] !== urlSegments[i]) {
                        isMatch = false;
                        break;
                    }
                }

                if (isMatch) {
                    return (
                        <ParamsContext.Provider value={params}>
                            {element}
                        </ParamsContext.Provider>
                    );
                }
            }
        }
    }

    return null; // No route matched
};

export const Route = ({ path, element }: { path: string; element: React.ReactNode }) => element;


// --- LAYOUT COMPONENTS ---

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