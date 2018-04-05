const googleApiKey = 'AIzaSyDL8Bx9LKau7b2Xa0LG16aGd53kTdiHbfQ';
const baseGSLUrl =
  'https://costa-platform-staging.com/locations/v2/stores?maxrec=0&radius=5&';
const baseGoogleUrl =
  'https://maps.googleapis.com/maps/api/place/textsearch/json?&key=' +
  googleApiKey +
  '&query=';
const london = {
  lat: 51.507222,
  lng: -0.1275
};

let map;

// Google text search API
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

// Process input with the autocomplete from GOOGLE API
function handleUserInputAutocomplete() {
  let autocomplete;
  const options = {
    //  types: [{ country: 'UK' }]
    componentRestrictions: { country: 'uk' }
  };
  autocomplete = new google.maps.places.Autocomplete(
    window.searchText,
    options
  );
}

// Process input - search text api with it and return LatLong coordinates for GSL
function processSearchValue(targetdiv) {
  let value = document.getElementById(targetdiv).value;
  let doAThing = googleTextSearch(baseGoogleUrl, value, responseText => {
    const results = responseText.results;
    if (results.length === 0) {
      console.log('no results found!');
    } else {
      let place = results[0].geometry.location;
      let location = { lat: place.lat, lng: place.lng };
      getGSLByLatLong(location, respObject => {
        //reposition map to new locale
        let center = new google.maps.LatLng(location.lat, location.lng);
        map.panTo(center);
        //map out costa results
        respObject.stores.map(s => {
          let marker = new google.maps.Marker({
            position: {
              lat: parseFloat(s.latitude),
              lng: parseFloat(s.longitude)
            },
            map: map,
            label: s.storeFacilities.find(f => {
              return f.name === 'Costa Express' && f.active == true;
              console.log(f);
            })
              ? 'E'
              : null
          });
          const infoWindow = new google.maps.InfoWindow({
            content: s.storeAddress.addressLine1
          });
          // improvement - when another window is clicked it becomes the focus and this closes down...
          marker.addListener('click', () => {
            infoWindow.close();
            infoWindow.open(map, marker);
          });
        });
      });
    }
  });
}

// Search for stores on GSL by lat long
function getGSLByLatLong(coords, callback) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      let respObj = JSON.parse(xmlHttp.responseText);
      callback(respObj); // do something with the returned stores array
    }
  };
  xmlHttp.open(
    'GET',
    baseGSLUrl + 'latitude=' + coords.lat + '&longitude=' + coords.lng,
    true
  );
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
  window.searchText.onkeyup = handleUserInputAutocomplete; // onchange is not a property of input box
}

function makeAndPlotMap(coords) {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: coords
  });
}
