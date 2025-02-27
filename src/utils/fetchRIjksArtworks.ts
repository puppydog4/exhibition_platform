export default async function fetchRijiksArtWorks({
  queryKey,
}: {
  queryKey: string[];
}): Promise<any> {
  const response = await fetch(
    queryKey[0] +
      `${process.env.NEXT_PUBLIC_RIJKS_API_KEY}` +
      queryKey[1] +
      queryKey[2] +
      queryKey[3] +
      queryKey[4]
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data.artObjects;
}
