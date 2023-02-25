import { PUBLIC_API_URL, PUBLIC_URL } from "$env/static/public";
import type { Link } from "$lib/types/link.type";
import { z } from "zod";
import { restRequest } from "./request/request";

export function minimize(url: string, lengthMax = 21, end = "[...]") : string {
  if (url.length > lengthMax) return url.substring(0, lengthMax) + end;
  return url;
}

export function formatNumbers(number: number) : string {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return number.toString();
}

export function validateUrl(url: string) : boolean {
  const schema = z.object({
    url: z.string().regex(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/)
  }).safeParse({ url });

  return schema.success;
}

export function generateSlug(length = 5) : string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

export type LinkOptions = {
  password: string | null;
  slug: string | null;
};

export async function createLink(url: string, visitorId: string, userId: string | null, options: LinkOptions = {
  password: null,
  slug: null
}) : Promise<Link | null> {
  const response = await restRequest<Link>("post", PUBLIC_API_URL + "link/create", {
    body: JSON.stringify({
      url: url,
      slug: options.slug ? options.slug : generateSlug(),
      password: options.password ? options.password : null,
      userId: userId,
      visitorId: visitorId
    })
  });

  if (!response.success) {
    return null;
  }

  return response.data;
}

export async function getLink(slug: string) : Promise<Link | boolean> {
  const response = await restRequest<Link>("get", PUBLIC_URL + "api/link/" + slug);

  if (!response.success) {
    return false;
  }

  return response.data;
}

export async function deleteLink(slug: string) : Promise<boolean> {
  const response = await restRequest("delete", PUBLIC_URL + "api/link/delete", {
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      slug: slug
    })
  });

  if (!response.success) {
    return false;
  }

  return response.success;
}

export function isAlreadyGenerated(url: string, links: Link[]) : boolean {
  return links.some(link => link.url === url);
}

export function genVisitorId() : string {
  return "vId-" + generateSlug(40);
}