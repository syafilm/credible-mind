import client from "../../lib/algoliaService";

export async function fetchSearch(query: string, filter: string, page: number){
  try {
    const index = client.initIndex("news");
    const data = await index.search(query, {
      page: page,
      filters: filter,
    });
    return data;
  } catch (error) {
    console.error("Error fetching search:", error);
    throw error;
  }
}
