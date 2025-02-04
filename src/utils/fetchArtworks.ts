

export default async function fetchArtWorks({ queryKey }: { queryKey: string[] }): Promise<any> {

    const response = await fetch(queryKey[0]);
    console.log(process.env)
  
    if (!response.ok) {
  
      throw new Error('Network response was not ok');
  
    }
    let data = await response.json()
    return data
  
  }


