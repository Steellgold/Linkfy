import { PUBLIC_URL } from "$env/static/public";
import { AuthApiError } from "@supabase/supabase-js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

// eslint-disable-next-line
export const load = (async({ locals }) => {
  if (locals.session?.user) {
    throw redirect(303, "/");
  }

  return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async({ request, locals, cookies }) => {
    const body = Object.fromEntries(await request.formData());

    if (!body.email || !body.password || !body.confirmPassword) {
      return fail(400, { error: "Please fill out all fields" });
    }

    if (body.password !== body.confirmPassword) {
      return fail(400, { error: "Passwords do not match" });
    }

    const { error: err, data } = await locals.sb.auth.signUp({
      email: body.email as string,
      password: body.password as string
    });

    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, { error: err.message });
      }

      return fail(500, { error: err.message });
    }

    // TODO: use restRequest();
    const res = await fetch(PUBLIC_URL + "api/links/sync?visitorId=" + cookies.get("fpVisitorId") + "&userId=" + data.user?.id);
    if (!res.ok) return fail(500, { message: "Failed to synchronize links" });
    throw redirect(303, "/");
  }
};