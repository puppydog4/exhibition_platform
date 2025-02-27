"use client";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          mt: 5,
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          Discover Masterpieces from Around the World
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          maxWidth={600}
        >
          Explore art collections from renowned museums, spanning from the
          ancient era to the modern age.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            flexWrap: "wrap",
            mt: 3,
          }}
        >
          <Card sx={{ maxWidth: 400, boxShadow: 3, borderRadius: 2 }}>
            <CardActionArea component={Link} href="/rijks">
              <CardMedia
                component="img"
                height="250"
                image="/images/rijks.jpg"
                alt="Rijksmuseum"
              />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  Rijksmuseum
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore Dutch masterpieces from the Golden Age at the
                  Rijksmuseum.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card sx={{ maxWidth: 400, boxShadow: 3, borderRadius: 2 }}>
            <CardActionArea component={Link} href="/METcollections">
              <CardMedia
                component="img"
                height="250"
                image="/images/met.jpg"
                alt="The Met"
              />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  The Met
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Discover a world of art from ancient to contemporary at The
                  Metropolitan Museum of Art.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
