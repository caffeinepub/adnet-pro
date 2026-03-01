import { Link, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { User, Heart } from 'lucide-react';
import { useGetCallerUserProfile } from '../../hooks/useQueries';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const routerState = useRouterState();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const currentPath = routerState.location.pathname;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="font-display text-2xl tracking-widest text-primary leading-none">
                AD TRIBE
              </span>
            </Link>

            <nav className="flex items-center gap-6">
              {isAuthenticated && userProfile && (
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    currentPath === '/profile' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              )}
              <Button
                onClick={handleAuth}
                disabled={disabled}
                variant={isAuthenticated ? 'outline' : 'default'}
                className={
                  !isAuthenticated
                    ? 'bg-saffron hover:bg-saffron-dark text-forest-deep border-0 shadow-saffron'
                    : ''
                }
              >
                {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-border mt-16 py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1 flex-wrap">
            © {new Date().getFullYear()} AD TRIBE. Built with{' '}
            <Heart className="w-3.5 h-3.5 text-saffron fill-saffron inline" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
