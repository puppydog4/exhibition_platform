'use client';

import { Button } from "@mui/material";
import Link from "next/link";


export default function Home() {
    return (
      <>
      <h1>Welcome</h1>
      <Button href="/METcollections">MET</Button>
      <Button href="/rijks">rijksmuseum</Button>
      </>
    )
}
