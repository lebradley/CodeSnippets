const googleApiKey = 'AIzaSyDL8Bx9LKau7b2Xa0LG16aGd53kTdiHbfQ';
const baseurl =
  'https://costa-platform-uat.com/locations/stores?countryCode=UK&';
const baseGoogleUrl =
  'https://maps.googleapis.com/maps/api/place/textsearch/json?&key=' +
  googleApiKey +
  '&query=costa+';
const london = {
  lat: 51.507222,
  lng: -0.1275
};

let map;

function googleTextSearch(url, queryString, callback) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      let respObj = JSON.parse(xmlHttp.responseText);
      callback(respObj);
    }
  };
  queryString = queryString.trim().replace(/\s+/g, '+');
  xmlHttp.open('GET', baseGoogleUrl + queryString, true); // true marks asynchronous
  xmlHttp.send(null);
}

function processSearchValue2(targetdiv) {
  let value = document.getElementById(targetdiv).value;
  let doAThing = googleTextSearch(baseGoogleUrl, value, responseText => {
    const results = responseText.results;
    if (results.length === 0) {
      console.log('no results found!');
    } else {
      let place = results[0].geometry.location;
      let location = { lat: place.lat, lng: place.lng };
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: location
      });
      let marker = new google.maps.Marker({
        position: location,
        map: map
      });
    }
  });
}

function processSearchValue(targetdiv) {
  let value = document.getElementById(targetdiv).value;
  let latLong = getStoreByPostCode(baseurl, value, responseText => {
    const latLong = createLatLongObj(responseText);
    let location = { lat: latLong.lat, lng: latLong.long };
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: location
    });
    let marker = new google.maps.Marker({
      position: location,
      map: map
    });
  });
}

function createLatLongObj(responseText) {
  const long = responseText.stores[0].longitude;
  const lat = responseText.stores[0].latitude;
  const latLong = {
    long: parseFloat(long),
    lat: parseFloat(lat)
  };
  return latLong;
}

function getStoreByPostCode(theUrl, postalCode, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      let respObj = JSON.parse(xmlHttp.responseText);
      callback(respObj);
    }
  };
  xmlHttp.open('GET', theUrl + 'postalCode=' + postalCode, true); // true marks asynchronous
  xmlHttp.send(null);
}

// Starter method to layout the map when the user first lands on the page. Fix the HTML 5 Geolocation aspect
function initMap() {
  let defaultLocation;
  // if (!navigator.geolocation) {
  //   makeAndPlotMap(london);
  // }
  // navigator.geolocation.getCurrentPosition(
  //   pos => {
  //     console.log('this is where we went ' + pos);
  //     defaultLocation = {
  //       lat: pos.coords.latitude,
  //       lng: pos.coords.longitude
  //     };
  //     makeAndPlotMap(defaultLocation);
  //   },
  //   err => {
  //     console.log(err);
  //     defaultLocation = london;
  //     makeAndPlotMap(defaultLocation);
  //   }
  // );
  defaultLocation = london;
  makeAndPlotMap(defaultLocation);
}

function makeAndPlotMap(coords) {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: coords
  });
  let marker = new google.maps.Marker({
    position: coords,
    map: map
  });
}
