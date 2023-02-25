import { PUBLIC_API_URL } from "$env/static/public";
import type { Link } from "$lib/types/link.type";
import { restRequest } from "$lib/utils/request/request";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// eslint-disable-next-line
export const load = (async({ params, locals })  => {
  const { slug } = params;

  if (!locals.session?.user) {
    throw redirect(303, "/sign-in");
  }

  if (!slug) {
    throw redirect(303, "/");
  }

  const response = await restRequest<Link>("get", PUBLIC_API_URL + "link/get/" + slug);

  if (!response.success) {
    throw redirect(303, "/");
  }

  if (response.data.userId !== locals.session?.user.id) {
    throw redirect(307, "/");
  }

  return {
    link: response.data
  };
}) satisfies PageServerLoad;