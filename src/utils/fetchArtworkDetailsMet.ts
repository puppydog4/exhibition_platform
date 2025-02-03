export default async function fetchArtworkDetail(objectID: number) {
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch artwork details");
    }
    return response.json();
  }