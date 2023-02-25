import { PUBLIC_API_URL, PUBLIC_URL } from "$env/static/public";
import type { Link } from "$lib/types/link.type";
import { restRequest } from "$lib/utils/request/request";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// eslint-disable-next-line
export const load = (async({ params }) => {
  const { slug } = params;

  if (!slug) throw redirect(303, PUBLIC_URL);

  const data = await restRequest<Link>("get", PUBLIC_API_URL + "link/get/" + slug + "/url");
  if (!data.success) throw redirect(303, PUBLIC_URL);

  return { url: data.data.url };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async({ request, params }) => {
    const body = Object.fromEntries(await request.formData());

    if (body.password === "" || body.password == null) {
      return fail(400, { error: "Password is required" });
    }

    const { slug } = params;
    const data = await restRequest<Link>("get", PUBLIC_API_URL + "link/get/" + slug + "/url,password");
    if (!data.success) return fail(400, { error: data.data.message });

    const verify = await restRequest<{ passwordMatch: boolean; }>("get", PUBLIC_API_URL + `link/${slug}/password/verify/${body.password}`);
    if (!verify.success) return fail(400, { error: verify.data.message });

    if (!verify.data.passwordMatch) return fail(400, { error: "Password is incorrect" });
    throw redirect(303, data.data.url);
  }
};