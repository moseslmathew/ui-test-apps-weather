import axios from "axios";
const url =
  "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_sum,windspeed_10m_max&current_weather=true&precipitation_unit=inch";

export function getWeather(lat, lon, timezone) {
  return axios
    .get(url, {
      params: {
        latitude: lat,
        longitude: lon,
        timezone: timezone,
      },
    })
    .then(({ data }) => {
      // console.log("All  Weather: ", data);      
      // console.log("Hourly Data: ",getDailyWeather(data))
      // console.log("Hourly Data: ",getHourlyWeather(data))      
      return {
        current: getCurrentWeather(data),
        daily: getDailyWeather(data),
        hourly: getHourlyWeather(data)
      };
    });
}

const getCurrentWeather = (data) => {
  const {
    temperature: currentTepratrature,
    windspeed: windSpeed,
    weathercode: iconCode,
  } = data.current_weather;
  const {
    temperature_2m_max: [maxTem],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [FLhigh],
    precipitation_sum: [precip],
  } = data.daily;

  return {
    currentTepratrature: Math.round(currentTepratrature),
    lowTemp: Math.round(minTemp),
    highTemp: Math.round(maxTem),
    feelsLikeHigh: Math.round(FLhigh),
    feelsLikeLow: Math.round(FLhigh),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    iconCode,
  };
};

const getDailyWeather = (data) => {
  return data.daily.time.map((item, index) => {        
    return {
      timeStamp:item,
      maxTemp:data.daily.temperature_2m_max[index],
      minTemp:data.daily.temperature_2m_min[index],
      icon:data.daily.weathercode[index],
      feelsLike:data.daily.apparent_temperature_max[index]
    }
  });  
};

const getHourlyWeather=(data) => {    
  return data.hourly.time.map((item,index) => {
    return{
      timeStamp:item,
      feeslLiksTemp:data.hourly.apparent_temperature[index],   
      icon:data.hourly.weathercode[index],   
      windspeed:data.hourly.windspeed_10m[index],
      precipitation:data.hourly.precipitation[index],
    }
  }).filter(item=>item.timeStamp>=data.current_weather.time)  
}
