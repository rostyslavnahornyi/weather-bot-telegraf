import axios from "axios";
import weather from "./textWeather.js";

export const fetchData = async (lang, { lat, lon }) => {
    try {
        const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=${lang}&exclude=minutely,hourly,alerts&units=metric&appid=${process.env.API_KEY}`;

    const response = await axios.get(URL)
    const DATA = response.data;

    let current = "";
    let tomorrow = "";
    let week = "";

    current = weather[lang](DATA.daily[0]);
    tomorrow = weather[lang](DATA.daily[1]);
    DATA.daily.forEach((day) => {
        week += weather[lang](day);
    });

    return { current, tomorrow, week };
    } catch (error) {
        console.log(error);
    }
};
