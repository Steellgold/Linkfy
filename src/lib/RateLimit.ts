import * as DayJS from "dayjs";

export const rl: { [key: string]: { count: number; expiration: number } } = {};

export function rateLimit(ipAddress: string): boolean {
  const key = `rate-limit-${ipAddress}`;
  const now = DayJS.default().unix();

  if (rl[key] && rl[key].expiration > now) {
    rl[key].count++;
    if (rl[key].count > 10) {
      console.error("Too Many Requests: You have exceeded the rate limit");
      return true;
    }
  } else {
    rl[key] = { count: 1, expiration: now + 10 };
    return false;
  }

  return false;
}