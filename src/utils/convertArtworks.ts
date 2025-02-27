import { ExhibitionArtwork } from "./supabaseCollections";

export type MetMuseumArtwork = {
  objectID: number; // Equivalent to artwork_id
  title: string;
  artistDisplayName: string; // Equivalent to artist
  primaryImage: string; // Image URL
};

export type RijksmuseumArtwork = {
  objectNumber: string; // Equivalent to artwork_id
  longTitle: string; // Equivalent to title
  principalOrFirstMaker: string; // Equivalent to artist
  webImage?: { url: string }; // Image URL (optional)
  language: string;
};

export const convertRijksToExhibitionArtwork = (
  artwork: RijksmuseumArtwork,
  exhibitionId: string
): Omit<ExhibitionArtwork, "id"> => ({
  exhibition_id: exhibitionId,
  artwork_id: artwork.objectNumber,
  title: artwork.longTitle,
  artist: artwork.principalOrFirstMaker || "Unknown",
  image_url: artwork.webImage?.url || "",
  museum: "Rijks",
  api_url: `https://www.rijksmuseum.nl/api/${artwork.language}/${artwork.objectNumber}`,
});

export const convertMetToExhibitionArtwork = (
  artwork: MetMuseumArtwork,
  exhibitionId: string
): Omit<ExhibitionArtwork, "id"> => ({
  exhibition_id: exhibitionId,
  artwork_id: String(artwork.objectID),
  title: artwork.title,
  artist: artwork.artistDisplayName || "Unknown",
  image_url: artwork.primaryImage || "",
  museum: "MET",
  api_url: `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artwork.objectID}`,
});
