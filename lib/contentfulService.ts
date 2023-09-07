import { createClient } from "contentful";

const client = createClient({
  space: "x0aigtiomhhn",
  accessToken: "14uSk-q-o8RqZgKgPVtmIjz51Vt6elZvVU4lUyN9WDc",
  host: "cdn.contentful.com",
});

export default client;
