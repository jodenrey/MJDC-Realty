import { createClient } from "contentful";
import { CONTENTFUL_SPACEID } from "./config";
import { CONTENTFUL_API_TOKEN } from "./config";

export const client = createClient({
  space: CONTENTFUL_SPACEID,
  accessToken: CONTENTFUL_API_TOKEN,
});
