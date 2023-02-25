import { PUBLIC_URL } from "$env/static/public";
import { AuthApiError } from "@supabase/supabase-js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async({ request, locals, cookies }) => {
    const body = Object.fromEntries(await request.formData());

    const { error: err, data } = await locals.sb.auth.signInWithPassword({
      email: body.email as string,
      password: body.password as string
    });

    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, { error: err.message });
      }
      return fail(500, { message: err.message });
    }

    // TODO: use restRequest();
    const res = await fetch(PUBLIC_URL + "api/links/sync?visitorId=" + cookies.get("fpVisitorId") + "&userId=" + data.user?.id);
    if (!res.ok) return fail(500, { message: "Failed to synchronize links" });
    throw redirect(303, "/");
  }
};