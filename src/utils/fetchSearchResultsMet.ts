// Helper function to fetch search results from the Met Museum API.
export default async function fetchSearchResults(apiUrl: string) {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Network error while fetching search results");
  }
  return response.json();
}
