import { getWeather } from "./weather";

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone)
  .then((data) => {rederCurrent(data.current)})
  .catch((e) => {
    console.log("Error", e);
  });

const rederCurrent = (data) => {
  console.log("Current", data);
  document.querySelector("[data-current-temp]").textContent=data.currentTepratrature;
};
