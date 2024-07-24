/**
 *  This is a GET route that is responsible for warming up the SSR pages Lambda.
 * */
import { getBaseUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WarmupPage() {
  void fetch(getBaseUrl() + "/api/warmup");
  return "ssr lambda is warm";
}
