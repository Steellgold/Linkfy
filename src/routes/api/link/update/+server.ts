import prisma from "$lib/database/prisma";
import { rateLimit } from "$lib/RateLimit";
import z from "zod";
import type { RequestEvent } from "./$types";

export async function PUT({ request, getClientAddress }: RequestEvent): Promise<Response> {
  if (rateLimit(getClientAddress().slice(7))) {
    return new Response("Too Many Requests: You have exceeded the rate limit", { status: 429 });
  }

  if (!request.body) {
    return new Response("Bad Request: Your request body is empty", { status: 400 });
  }

  const body = await request.json();
  const schema = z
    .object({
      slug: z.string(),
      data: z.object({
        url: z
          .string()
          .regex(/^https?:\/\//)
          .optional(),
        slug: z.string().optional(),
        clicks: z.number().optional(),
        status: z.boolean().optional()
      })
    })
    .safeParse(body);

  if (!schema.success) return new Response("Bad Request: " + schema.error.message, { status: 400 });

  const link = await prisma.link.update({
    where: {
      slug: schema.data.slug
    },
    data: schema.data.data
  });

  return new Response(JSON.stringify(link), { status: 200 });
}