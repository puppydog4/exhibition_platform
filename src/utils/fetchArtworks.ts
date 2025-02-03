import axios from "axios";

export default async function fetchArtWorks(url : string){
    let response = await axios.get(url)
    console.log(response.data.objectIDs)
    return response.data.total
}


