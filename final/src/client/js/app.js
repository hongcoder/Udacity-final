const result = document.querySelector("#result");
const planner = document.querySelector("#planner");
const addTripButton = document.querySelector(".map__link");
const printButton = document.querySelector("#save");
const deleteButton = document.querySelector("#delete");
const form = document.querySelector("#form");
const leavingFrom = document.querySelector('input[name="from"]');
const goingTo = document.querySelector('input[name="to"]');
const depDate = document.querySelector('input[name="date"]');
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = "hongcoder";
const timestampNow = (Date.now()) / 1000;
const pixabayURL = 'https://pixabay.com/api/?key=';
const pixabayKey = '16831940-05eda7b9d76d6800286d0f7ff';
const weatherBitURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const weatherBitKey = '22d51224494b4603b7dc66703e3cd850';


//Event listners;

//add trip btn

const addTripEvList = addTripButton.addEventListener('click', function (e) {
  e.preventDefault();
  planner.scrollIntoView({ behavior: 'smooth' });
})
// form submit
form.addEventListener('submit', addTrip);
// print button
printButton.addEventListener('click', function (e) {
  window.print();
  location.reload();
});
// delete button
deleteButton.addEventListener('click', function (e) {
  form.reset();
  result.classList.add("invisible");
  location.reload();
})


//Function called when form is submitted
export function addTrip(e) {
  e.preventDefault();
  //Acquiring and storing user trip data
  const leavingFromText = leavingFrom.value;
  const goingToText = goingTo.value;
  const depDateText = depDate.value;
  const timestamp = (new Date(depDateText).getTime()) / 1000;


  Client.checkInput(leavingFromText, goingToText);


  getCityInfo(geoNamesURL, goingToText, username)
    .then((cityData) => {
      const cityLat = cityData.geonames[0].lat;
      const cityLong = cityData.geonames[0].lng;
      const country = cityData.geonames[0].countryName
      const weatherData = getWeather(cityLat, cityLong, country, timestamp)
      return weatherData;
    })
    .then((weatherData) => {
      const daysLeft = Math.round((timestamp - timestampNow) / 86400);
      const userData = postData('http://localhost:7070/add', { leavingFromText, goingToText, depDateText, weather: weatherData.data[0].temp, summary: weatherData.data[0].weather.description ,daysLeft });
      return userData;
    }).then((userData) => {
      updateUI(userData);
    })
}


//function getCityInfo to get city information from Geonames (latitude, longitude, country)

export const getCityInfo = async (geoNamesURL, goingToText, username) => {
  // res equals to the result of fetch function
  const res = await fetch(geoNamesURL + goingToText + "&maxRows=10&" + "username=" + username);
  try {
    const cityData = await res.json();
    return cityData;
  } catch (error) {
    console.log("error", error);
  }
};


export const getWeather = async (cityLat, cityLong, country, date) => {
  const req = await fetch(`${weatherBitURL}lat=${cityLat}&lon=${cityLong}&key=${weatherBitKey}`);
  try {
    const weatherData = await req.json();
    return weatherData;
  } catch (error) {
    console.log('error', error);
  }
}



//Function postData to post data to our local server
export const postData = async (url = '', data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      depCity: data.leavingFromText,
      arrCity: data.goingToText,
      depDate: data.depDateText,
      weather: data.weather,
      summary: data.summary,
      daysLeft: data.daysLeft
    })
  })
  try {
    const userData = await req.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
}

//Function update UI that reveals the results page with updated trip info including fetched image of the destination

export const updateUI = async (userData) => {
  result.classList.remove("invisible");
  result.scrollIntoView({ behavior: "smooth" });

  const res = await fetch(pixabayURL + pixabayKey + "&q=" + userData.arrCity + "+city&image_type=photo");

  try {
    const imageLink = await res.json();
    const dateSplit = userData.depDate.split("-").reverse().join(" / ");
    document.querySelector("#city").innerHTML = userData.arrCity;
    document.querySelector("#date").innerHTML = dateSplit;
    document.querySelector("#days").innerHTML = userData.daysLeft;
    document.querySelector("#summary").innerHTML = userData.summary;
    document.querySelector("#temp").innerHTML = userData.weather;
    document.querySelector("#fromPixabay").setAttribute('src', imageLink.hits[0].webformatURL);
  }
  catch (error) {
    console.log("error", error);
  }
}

export { addTripEvList }