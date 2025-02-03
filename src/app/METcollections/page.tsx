'use client'
import fetchArtWorks from "@/utils/fetchArtworks"
import { ButtonProps, ToggleButton } from "@mui/material"
import { Box, Button, ButtonGroup } from "@mui/material"
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"


const queryClient = new QueryClient()

export default function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Artworks />
    </QueryClientProvider>
  )
}



function Artworks() {

  const {isLoading , isError , data , error} = useQuery({ queryKey: ['https://collectionapi.metmuseum.org/public/collection/v1/departments' , "1"], queryFn: fetchArtWorks })

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
  <Box >
    <Button href="/">Home</Button>
    <ButtonGroup sx = {{display: 'flex',
    flexDirection : "row", 
    flexWrap: 'wrap',
    p: 1,
    m: 1,
    bgcolor: 'background.paper',
    maxWidth: 3000,
    borderRadius: 1,}}>{data.departments.map((department : {displayName : string , departmentId : number}) => {return  <ToggleButton key={department.departmentId} value={department.displayName}  sx={{m: 1 , p : 1}}>{department.displayName}</ToggleButton>})}</ButtonGroup>
  </Box>
  )
}


