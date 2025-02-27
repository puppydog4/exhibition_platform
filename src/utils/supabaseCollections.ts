import { useAuth } from "@/context/authContext";
import { supabase } from "./supabaseClient";

// Type definition for an Exhibition (you can adjust as needed)
export type Exhibition = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
};

/**
 * @param title - The title of the new exhibition.
 * @param description - (Optional) A description of the exhibition.
 * @returns The created exhibition data.
 */

export const createExhibition = async (
  userId: string,
  title: string,
  description?: string
): Promise<Exhibition> => {
  const payload = { user_id: userId, title, description };
  console.log("Payload being inserted:", payload);
  const session = await supabase.auth.getSession();
  console.log("Session:", session);
  const { data, error } = await supabase
    .from("exhibitions")
    .insert([{ user_id: userId, title, description }])
    .select("*")
    .single();

  if (error) {
    throw new Error(`Error creating exhibition: ${error.message}`);
  }

  return data as Exhibition;
};

/**
 * Get all exhibitions for the specified user.
 * @param userId - The current user's ID.
 * @returns An array of exhibitions.
 */
export const getUserExhibitions = async (
  userId: string
): Promise<Exhibition[]> => {
  const { data, error } = await supabase
    .from("exhibitions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Error fetching exhibitions: ${error.message}`);
  }

  return data as Exhibition[];
};

export const deleteUserExhibition = async (
  exhibitionId: string
): Promise<void> => {
  const { error } = await supabase
    .from("exhibitions")
    .delete()
    .eq("id", exhibitionId);

  if (error) {
    throw new Error(`Error deleting exhibition: ${error.message}`);
  }
};

export type ExhibitionArtwork = {
  id: string;
  exhibition_id: string;
  user_id: any;
  artwork_id: string;
  title: string;
  artist: string;
  image_url: string;
  museum: string;
  api_url: string;
};

export const addArtworkToExhibition = async (
  exhibitionId: string,
  artwork: Omit<ExhibitionArtwork, "id" | "exhibition_id">
): Promise<ExhibitionArtwork> => {
  const payload = { exhibition_id: exhibitionId, ...artwork };
  const { data, error } = await supabase
    .from("exhibition_artworks")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Error adding artwork: ${error.message}`);
  }

  return data as ExhibitionArtwork;
};

export const getExhibitionArtworks = async (
  exhibitionId: string
): Promise<ExhibitionArtwork[]> => {
  const { data, error } = await supabase
    .from("exhibition_artworks")
    .select("*")
    .eq("exhibition_id", exhibitionId);

  if (error) {
    throw new Error(`Error fetching artworks: ${error.message}`);
  }
  return data as ExhibitionArtwork[];
};

export const removeArtworkFromExhibition = async (
  artworkId: string,
  exhibitionId: string
): Promise<void> => {
  const { error } = await supabase
    .from("exhibition_artworks")
    .delete()
    .eq("artwork_id", artworkId)
    .eq("exhibition_id", exhibitionId);

  if (error) {
    throw new Error(`Error removing artwork: ${error.message}`);
  }
};
