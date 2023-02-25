import prisma from "$lib/database/prisma";
import { rateLimit } from "$lib/RateLimit";
import type { RequestEvent } from "./$types";

export async function GET({ request, getClientAddress }: RequestEvent): Promise<Response> {
  if (rateLimit(getClientAddress().slice(7))) {
    return new Response("Too Many Requests: You have exceeded the rate limit", { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || null;
  const visitorId = searchParams.get("visitorId") || null;

  if (!userId || !visitorId) {
    return new Response("Bad Request: You must provide a userId and a visitorId", { status: 400 });
  }

  const links = await prisma.link.updateMany({
    where: {
      visitorId: visitorId,
      userId: null
    },
    data: {
      userId: userId
    }
  });

  if (!links) {
    return new Response("Internal Server Error: Failed to synchronize links", { status: 500 });
  }
  return new Response(JSON.stringify(links), { status: 200 });
}