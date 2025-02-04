export default async function fetchRijiksArtWorks({
  queryKey,
}: {
  queryKey: string[];
}): Promise<any> {
  const response = await fetch(
    queryKey[0] + `${process.env.NEXT_PUBLIC_RIJKS_API_KEY}` + queryKey[1] + queryKey[2]
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  let data = await response.json();
  console.log(data.artObjects)
  return data.artObjects;
}
