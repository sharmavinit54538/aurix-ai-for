import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/redux/store";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, Suspense, type ReactNode } from "react";
import { bootstrapAuth } from "../lib/auth-bootstrap";
import { PageSkeleton } from "../components/common/PageSkeleton";
import {
  isChunkLoadError,
  safeReloadOnChunkFailure,
  setupGlobalChunkErrorListeners,
  clearChunkReloadFlag,
  unregisterLegacyServiceWorkers,
} from "../lib/chunk-reload";

import appCss from "../styles.css?url";
import { ThemeProvider } from "../components/site/ThemeProvider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const isChunkError = isChunkLoadError(error);

  useEffect(() => {
    console.error("Root error boundary caught error:", error);
    if (isChunkError) {
      safeReloadOnChunkFailure("ErrorComponent");
    }
  }, [error, isChunkError]);

  if (isChunkError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              className="h-6 w-6 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            App Update Available
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A new version of OFC360 has been deployed. Please refresh to load the latest features and updates.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("_v", String(Date.now()));
                window.location.replace(url.toString());
              }}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Update & Refresh Now
            </button>
            <a
              href="/"
              className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "OFC360 — Operations & Intelligence Platform" },
      { name: "description", content: "Futuristic operations and intelligence platform for modern enterprise teams." },
      { name: "author", content: "OFC360" },
      { property: "og:title", content: "OFC360" },
      { property: "og:description", content: "Futuristic operations and intelligence platform for modern enterprise teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@OFC360" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  window.addEventListener('vite:preloadError', function(event) {
                    event.preventDefault();
                    var tsKey = 'ofc360_chunk_reload_ts';
                    var last = parseInt(sessionStorage.getItem(tsKey) || '0', 10);
                    var now = Date.now();
                    if (now - last > 15000) {
                      sessionStorage.setItem(tsKey, String(now));
                      sessionStorage.setItem('ofc360_chunk_reload_attempted', 'true');
                      var url = new URL(window.location.href);
                      url.searchParams.set('_v', String(now));
                      window.location.replace(url.toString());
                    }
                  });

                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(regs) {
                      regs.forEach(function(r) { r.unregister(); });
                    }).catch(function() {});
                  }
                  // Intentionally ignored: Raw inline browser bootstrap script (cannot import modules or safely log before page loads)
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    void bootstrapAuth();
    unregisterLegacyServiceWorkers();
    const cleanupListeners = setupGlobalChunkErrorListeners();
    clearChunkReloadFlag();
    return () => {
      cleanupListeners();
    };
  }, []);

  return (
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
