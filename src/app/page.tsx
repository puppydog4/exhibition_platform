"use client";

import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mt: 5 }}>
      {/* Rijksmuseum Card */}
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea component={Link} href="/rijks" target="_blank">
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Rijksmuseum_Amsterdam.jpg/800px-Rijksmuseum_Amsterdam.jpg"
            alt="Rijksmuseum"
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              Rijksmuseum
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explore the Dutch masterpieces from the Golden Age at the Rijksmuseum.
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      {/* The Met Card */}
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea component={Link} href="/METcollections" target="_blank">
          <CardMedia
            component="img"
            height="200"
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/The_Metropolitan_Museum_of_Art_Main_Entrance_%28cropped%29.jpg/800px-The_Metropolitan_Museum_of_Art_Main_Entrance_%28cropped%29.jpg"
            alt="The Met"
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              The Met
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Discover a world of art from ancient to contemporary at The Metropolitan Museum of Art.
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}
