/**
 *  This is a GET route that is responsible for warming up the SSR pages Lambda.
 * */

export const dynamic = "force-dynamic";

export default async function WarmupPage() {
  void fetch("/api/warmup");
  return "ssr lambda is warm";
}
