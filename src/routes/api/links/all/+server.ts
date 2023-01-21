import { db } from "$lib/utils/db/Supabase";
import { PUBLIC_DATABASE_NAME } from "$env/static/public";
import type { RequestEvent } from "./$types";

export async function GET({ request }: RequestEvent): Promise<any> {
  const { searchParams } = new URL(request.url);

  const visitorId = searchParams.get("visitorId") ?? null;
  const userId = searchParams.get("userId") ?? null;

  if (!visitorId && !userId) return new Response("Invalid data: visitorId or userId is required", { status: 400 });
  const type: "visitorId" | "userId" = visitorId ? "visitorId" : "userId";
  const id = visitorId ?? userId;

  const { data: links, error } = await db
    .from(PUBLIC_DATABASE_NAME)
    .select("id")
    .eq(type, id);

  if (error) return error;
  return new Response(JSON.stringify(links.length), { status: 200 });
}