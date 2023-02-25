import prisma from "$lib/database/prisma";
import "$lib/database/supabase";
import { genVisitorId } from "$lib/utils/link";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async({ event, resolve }) => {
  const { session, supabaseClient } = await getSupabase(event);

  const visitorId = event.cookies.get("fpVisitorId");

  if (!visitorId) {
    event.locals.visitorId = genVisitorId();
    event.cookies.set("fpVisitorId", event.locals.visitorId, {  path: "/", maxAge: 60 * 60 * 24 * 365 });
  } else {
    event.locals.visitorId = visitorId;
  }

  event.locals.sb = supabaseClient;
  event.locals.session = session;

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (user) {
      event.locals.user = { email: user.email, id: user.id, isPremium: user.isPremium, role: user.role as "user" | "admin" };
    } else {
      event.locals.user = null;
    }
  }

  return resolve(event);
};