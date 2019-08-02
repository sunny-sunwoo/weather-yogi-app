const ITEM = "dataItem";

const selfies = [];

document.getElementById('time').addEventListener('click', event => {
  sortData((a, b) => b.time - a.time);
});

function sortData(compare) {
  for (let item of selfies) {
    item.elt.remove();
  }
  selfies.sort(compare);
  for (let item of selfies) {
    document.body.append(item.elt);
  }
}

// 1. build a map and tile
const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

// 2. customize icon and create a marker
function displayData(data) {
  let i = 0;
  for (item of data) {
    const root = document.createElement('div');
    root.className = ITEM;
    root.id = i;
    i++;
    const geo = document.createElement('p');
    const date = document.createElement('p');

    geo.textContent = `${item.lat}˚, ${item.lon}˚`;
    const dateString = new Date(item.timestamp).toLocaleString('EN');
    date.textContent = dateString;

    root.append(geo, date);
    document.body.append(root);

    selfies.push({ elt: root, time: item.timestamp});
    document.body.append(root);
  }
}

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();
  displayData(data);
  console.log(data);
  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    let txt = `The weather here at ${item.lat}&deg;,
    ${item.lon}&deg; is ${item.weather.summary} with
    a temperature of ${item.weather.temperature}&deg; C.`;

    if (item.air.value < 0) {
      txt += '  No air quality reading.';
    } else {
      txt += `  The concentration of particulate matter 
    (${item.air.parameter}) is ${item.air.value} 
    ${item.air.unit} last read on ${item.air.lastUpdated}`;
    }
    marker.bindPopup(txt);
  }
  console.log(data);
 }

getData();