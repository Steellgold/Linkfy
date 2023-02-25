import prisma from "$lib/database/prisma";
import { rateLimit } from "$lib/RateLimit";
import z from "zod";
import type { RequestEvent } from "./$types";

export async function DELETE({ request, getClientAddress }: RequestEvent): Promise<Response> {
  if (rateLimit(getClientAddress().slice(7))) {
    return new Response("Too Many Requests: You have exceeded the rate limit", { status: 429 });
  }

  if (!request.body) {
    return new Response("Bad Request: Your request body is empty", { status: 400 });
  }

  const body = await request.json();
  const schema = z
    .object({
      slug: z.string()
    })
    .safeParse(body);

  if (!schema.success) return new Response("Bad Request: " + schema.error.message, { status: 400 });

  await prisma.link.delete({
    where: {
      slug: schema.data.slug
    }
  });

  return new Response(JSON.stringify({
    success: true
  }), { status: 200 });
}