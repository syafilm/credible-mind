import algoliasearch from "algoliasearch/lite";

const APPLICATION_ID = "PY17S3DJJE";
const SEARCH_API_KEY = "0963d1bb0cdb44a8c33f0a00013ddea9";

const client = algoliasearch(APPLICATION_ID, SEARCH_API_KEY);

export default client;
