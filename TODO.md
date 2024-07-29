# Improvements

## UX

- [ ] Apply validation to the frontend
- [ ] Handle error state to the frontend (error boundary + toast)
- [ ] Handle loading state (suspense + animated skeletons)

## Security

- [ ] Add validation to the backend (return 400 on invalid input)
- [ ] Add error handling to the backend (return 500 on error)
- [ ] Add rate limiting to the backend w/ upstash (return 429 on rate limit)

## Performance

- [ ] Build a cron job to to warmup the lambdas
- [x] Routes should be server components
  - [x] prefetch data on routes using `prefetch()` or `ensureQueryData()`
  - [x] wrap client components with `<HydrateClient></HydrateClient>`
  - [x] use `useSuspenseQuery()` to fetch data
  - [x] build a custom hook for each query
- [x] On mutations, manually update the query cache for faster feedback
  - [x] invalidate the cache after the mutation is complete

## Architecture

- [ ] Use layered / clean architecture
  - [ ] trpc for api
  - [ ] use-case functions for business logic
  - [ ] drizzle for data-access

## Extras

- [ ] Add dark mode
- [ ] Add analytics using Posthog
  - [ ] Learn how to rollout updates to a subset of users
  - [ ] Learn how to use feature flags
- [ ] Add error management using Sentry
