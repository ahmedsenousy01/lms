/**
 *  This is a GET route that is responsible for warming up the API Lambda.
 * */

export async function GET() {
  return new Response("api lambda is warm");
}
