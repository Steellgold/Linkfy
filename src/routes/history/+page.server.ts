import { PUBLIC_API_URL } from "$env/static/public";
import type { Link } from "$lib/types/link.type";
import { restRequest } from "$lib/utils/request/request";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// eslint-disable-next-line
export const load = (async({ cookies, locals }) => {
  let requestUrl = "";
  if (locals.user) {
    requestUrl = "user/" + locals.user.id;
  } else {
    requestUrl = "visitor/" + locals.visitorId;
  }

  const response = await restRequest<Link[]>("get", PUBLIC_API_URL + "links/get/" + requestUrl);

  if (!response.success) {
    throw error(500, { message: "Internal server error", code: 500 });
  }

  return {
    links: response.data
  };
}) satisfies PageServerLoad;