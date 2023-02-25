import type { Method, RequestParams } from "./request.types";
import type { Response } from "./request.types";
import { paramsToString } from "./request.utils";

export const restRequest = async <T>(
  method: Method,
  endpoint: string,
  { query, ...config }: RequestParams = {},
  contentTypesNeeded: string[] = [],
  asPrefix = false
): Promise<Response<T>> => {
  if (query) {
    endpoint += paramsToString(query, asPrefix);
  }

  const response = await fetch(endpoint, { ...config, method });

  if (!response.ok) {
    return {
      success: false,
      data: { code: response.status, message: response.statusText }
    };
  }

  const contentType = response.headers.get("content-type");

  if (contentTypesNeeded.length > 0) {
    if (!contentType) {
      return {
        success: false,
        data: { code: 500, message: "No content type" }
      };
    }

    const isContentTypeValid = contentTypesNeeded.some(contentTypeNeeded => contentType.includes(contentTypeNeeded));

    if (!isContentTypeValid) {
      return {
        success: false,
        data: { code: 500, message: "Invalid content type" }
      };
    }
  }

  return {
    success: true,
    data: await response.json()
  };
};