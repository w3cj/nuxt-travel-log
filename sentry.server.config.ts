import * as Sentry from "@sentry/nuxt";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
