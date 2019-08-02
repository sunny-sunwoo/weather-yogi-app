const lat_span = document.querySelector("#latitude"),
  lon_span = document.querySelector("#longitude");

let geoInfo = {};

function displayGeolocation(lat, lon) {
  lat_span.textContent = lat.toFixed(2);
  lon_span.textContent = lon.toFixed(2);
}

function getGeolocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log(lat, lon);
      displayGeolocation(lat, lon);
      geoInfo = { lat, lon };
      sendWeatherRequest();
    });
  } else {
    console.log("geolocation not available");
  }
}

async function sendWeatherRequest() {
  const api_url = `weather/${geoInfo.lat},${geoInfo.lon}`;
  const response = await fetch(api_url);
  const json = await response.json();
  displayWeatherInfo(json);
  sendData(geoInfo);
}

function displayWeatherInfo(json) {
  // console.log(json);
  try {
    let weather = json.weather.currently;
    let air = json.airQuality.results[0].measurements[0];
    geoInfo.air = air;
    geoInfo.weather = weather;
    document.getElementById('summary').textContent = weather.summary;
    document.getElementById('temp').textContent = weather.temperature;
    document.getElementById('aq_parameter').textContent = air.parameter;
    document.getElementById('aq_value').textContent = air.value;
    document.getElementById('aq_units').textContent = air.unit;
    document.getElementById('aq_date').textContent = air.lastUpdated;
  } catch(error) {
    console.error(error);
    air = { value: -1 };
    document.getElementById('aq_value').textContent = 'NO READING';
  }
}

async function sendData(data) {
  console.log(data);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  };
  const db_response = await fetch('/api', options);
  const db_json = await db_response.json();
}

getGeolocation();