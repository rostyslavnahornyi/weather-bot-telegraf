import iconsCondition from "./iconsCondition.js";

const weather = {
    ua: (day) => `\n\nПогода на ${
        new Date(day.dt * 1000).getDay() < 10
            ? "0" + new Date(day.dt * 1000).getDate()
            : new Date(day.dt * 1000).getDate()
    }.${
        `${new Date(day.dt * 1000).getMonth() + 1}` < 10
            ? "0" + `${new Date(day.dt * 1000).getMonth() + 1}`
            : `${new Date(day.dt * 1000).getMonth() + 1}`
    }.${new Date(day.dt * 1000).getFullYear()}
Температура: ${Math.round(day.temp.min)}°C – ${Math.round(day.temp.max)}°C.
☁️ ${Math.round(day.temp.morn)}${day.temp.morn < 10 ? '  ' : ''} °C. — вранці
⛅️ ${Math.round(day.temp.day)}${day.temp.day < 10 ? '  ' : ''} °C. — вдень
🌤 ${Math.round(day.temp.eve)}${day.temp.eve < 10 ? '  ' : ''} °C. — увечері
🌑 ${Math.round(day.temp.night)}${day.temp.night < 10 ? '  ' : ''} °C. — вночі
Швидкість вітру: ${day.wind_speed} м/с.
Опис: ${day.weather[0].description}${
        iconsCondition[day.weather[0]["icon"].substring(0, 2)]
    }`,


    ru: (day) => `\n\nПогода на ${
        new Date(day.dt * 1000).getDay() < 10
            ? "0" + new Date(day.dt * 1000).getDate()
            : new Date(day.dt * 1000).getDate()
    }.${
        `${new Date(day.dt * 1000).getMonth() + 1}` < 10
            ? "0" + `${new Date(day.dt * 1000).getMonth() + 1}`
            : `${new Date(day.dt * 1000).getMonth() + 1}`
    }.${new Date(day.dt * 1000).getFullYear()}
Температура: ${Math.round(day.temp.min)}°C – ${Math.round(day.temp.max)}°C.
☁️  ${Math.round(day.temp.morn)}${day.temp.morn < 10 ? '  ' : ''} °C. — утром 
⛅️  ${Math.round(day.temp.day)}${day.temp.day < 10 ? '  ' : ''} °C. — днем
🌤  ${Math.round(day.temp.eve)}${day.temp.eve < 10 ? '  ' : ''} °C. — вечером
🌑  ${Math.round(day.temp.night)}${day.temp.night < 10 ? '  ' : ''} °C. — ночью
Скорость ветра: ${day.wind_speed} м/c.
Описание: ${day.weather[0].description}${
        iconsCondition[day.weather[0]["icon"].substring(0, 2)]
    }`,

    
    en: (day) => `\n\nWeather on ${
        new Date(day.dt * 1000).getDay() < 10
            ? "0" + new Date(day.dt * 1000).getDate()
            : new Date(day.dt * 1000).getDate()
    }.${
        `${new Date(day.dt * 1000).getMonth() + 1}` < 10
            ? "0" + `${new Date(day.dt * 1000).getMonth() + 1}`
            : `${new Date(day.dt * 1000).getMonth() + 1}`
    }.${new Date(day.dt * 1000).getFullYear()}
Temperature: ${Math.round(day.temp.min)}°C - ${Math.round(day.temp.max)}°C.
☁️ ${Math.round(day.temp.morn)}${day.temp.morn < 10 ? '  ' : ''} °C. — in the morning
⛅️ ${Math.round(day.temp.day)}${day.temp.day < 10 ? '  ' : ''} °C. — in the afternoon
🌤 ${Math.round(day.temp.eve)}${day.temp.eve < 10 ? '  ' : ''} °C. — in the evening
🌑 ${Math.round(day.temp.night)}${day.temp.night < 10 ? '  ' : ''} °C. — at night
Wind speed: ${day.wind_speed} m/s.
Description: ${day.weather[0].description}${
        iconsCondition[day.weather[0]["icon"].substring(0, 2)]
    }`,
};

export default weather;
