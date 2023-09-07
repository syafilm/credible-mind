import client from "../../lib/contentfulService";

export async function fetchEntries(){
  try {
    const data = await client.getEntries({
      content_type: `newsConfig`,
    });
    return data.items;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
}
