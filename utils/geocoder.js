import axios from "axios";
import utf8 from 'utf8';
import "dotenv/config";

const directGeocode = async (location) => {
    location = utf8.encode(location);
    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${process.env.API_KEY}`;
    
    const response = await axios.get(URL).catch(error => console.log(error));
    return response.data;
}

const reverseGeocode = async (lat, lon) => {
    const URL = `http://api.openweathermap.org/geo/1.0/reverse?q=lat=${lat}&lon=${lon}&limit=5&appid=${process.env.API_KEY}`;

    const response = await axios.get(URL).catch(error => console.log(error));
    return response.data; 
}

export {
    directGeocode,
    reverseGeocode,
}