-- Enable required extensions for cron jobs
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;