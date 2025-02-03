'use client';
import { useState } from "react";
import fetchArtWorks from "@/utils/fetchArtworks";

import { useEffect } from "react";

export default function Home() {
  const [total, setTotal] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      let numsOfObjects:string = await fetchArtWorks("https://collectionapi.metmuseum.org/public/collection/v1/objects");
      setTotal(numsOfObjects);
    };
    fetchData();
  }, []);

    return (
      <h1>Total Artworks : {total}</h1>
    )
}
