export default async function fetchArtWorksMet({
  queryKey,
}: {
  queryKey: string[];
}): Promise<any> {
  const response = await fetch(queryKey[0]);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}
