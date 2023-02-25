import { PUBLIC_URL, PUBLIC_API_URL } from "$env/static/public";
import type { Link } from "$lib/types/link.type";
import { restRequest } from "$lib/utils/request/request";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// eslint-disable-next-line
export const load = (async({ params }) => {
  if (!params.slug) throw redirect(303, PUBLIC_URL);
  const data = await restRequest<Link>("get", PUBLIC_API_URL + "link/get/" + params.slug + "/url,status,password");

  if (!data.success || !data.data.status) {
    throw error(404, { message: "This link not exist or has been disabled", code: 404 });
  }

  if (data.data.password !== "none") {
    throw redirect(303, PUBLIC_URL + params.slug + "/protected");
  }

  await restRequest("put", PUBLIC_API_URL + "link/increment/" + params.slug);

  return {
    status: data.data.status,
    url: data.data.url
  };
}) satisfies PageServerLoad;