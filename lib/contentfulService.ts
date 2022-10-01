import { createClient } from "contentful";

const client = createClient({
  space: "js9tcr1yo5ym",
  accessToken: "v188QINSp_3nRKiTGTtvFcWxihls-vHNcXgEa3XmZWM",
  host: "cdn.contentful.com",
});

export default client;
