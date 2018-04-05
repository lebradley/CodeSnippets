// https://stackoverflow.com/questions/44336773/google-maps-api-no-access-control-allow-origin-header-is-present-on-the-reque
// use builtin js functionality, not Xml Http requests

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

const stats = {
  longitude: {
    degree: 0.00001,
    metre: 0.67
  },
  latitude: {
    degree: 0.00001,
    metre: 1.1
  }
};

let map;

// xmlHttp helper method
function createXMLHTTP(callback) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      let respObj = JSON.parse(xmlHttp.responseText);
      callback(respObj);
    }
  };
  return xmlHttp;
}

// Google text search API
function googleTextSearch(url, queryString, callback) {
  const xmlHttp = createXMLHTTP(callback);
  queryString = queryString.trim().replace(/\s+/g, '+');
  xmlHttp.open('GET', baseGoogleUrl + queryString, true);
  xmlHttp.send(null);
}

// Google text search API
function googleTextSearch2(url, requestinput, callback) {
  let service = new google.maps.places.PlacesService(map);
  let request = {
    query: requestinput.trim().replace(/\s+/g, '+')
  };
  service.textSearch(request, callback);
}

// Process input with the autocomplete from GOOGLE API
function handleUserInputAutocomplete() {
  let autocomplete;
  const options = {
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
  let doAThing = googleTextSearch2(baseGoogleUrl, value, results => {
    window.searchResult.innerHTML = '';
    if (results.length === 0) {
      window.searchResult.innerHTML = 'No results found';
    } else {
      let place = results[0].geometry.location;
      let location = { lat: place.lat(), lng: place.lng() };
      getGSLByLatLong(location, respObject => {
        //map out costa results
        let markers = respObject.stores.map((s, i) => {
          let marker = new google.maps.Marker({
            position: {
              lat: parseFloat(s.latitude),
              lng: parseFloat(s.longitude)
            },
            map: map,
            label: s.storeFacilities.find(f => {
              return f.name === 'Costa Express' && f.active == true;
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
          return marker;
        });
        //reposition map to new locale
        let center = new google.maps.LatLng(location.lat, location.lng);
        let bounds = new google.maps.LatLngBounds().extend(location);
        bounds.extend(markers[0].position);
        bounds.extend(markers[1].position);
        map.panTo(center);
        map.fitBounds(bounds);

        //draw out boxes of the search results below the map
        let resultList = respObject.stores.map((s, i) => {
          let maindiv = document.createElement('div');
          maindiv.className = 'row list-item';
          let addressDiv = document.createElement('div');
          addressDiv.className = 'col-md-6 store-address';
          let storeDiv = document.createElement('div');
          storeDiv.className = 'col-md-6 store-facts';

          let addressArray = Object.keys(s.storeAddress).map(k => {
            return s.storeAddress[k];
          });
          addressArray.map((a, i) => {
            if (a.length > 0) {
              const span = document.createElement('span');
              span.innerHTML = a;
              addressDiv.appendChild(span);
            }
          });

          let openspan = document.createElement('span');
          openspan.innerHTML = s.isStoreOpen ? 'Open' : 'Closed';
          storeDiv.appendChild(openspan);

          let collectspan = document.createElement('span');
          collectspan.innerHTML = s.isCollectStore
            ? 'Collect Store'
            : 'Collect Not Available';
          storeDiv.appendChild(collectspan);

          maindiv.appendChild(addressDiv);
          maindiv.appendChild(storeDiv);
          maindiv.id = 'result' + i;
          document.getElementById('searchResultList').appendChild(maindiv);
        });
      });
    }
  });
}

// Search for stores on GSL by lat long
function getGSLByLatLong(coords, callback) {
  let xmlHttp = createXMLHTTP(callback);
  xmlHttp.open(
    'GET',
    baseGSLUrl + 'latitude=' + coords.lat + '&longitude=' + coords.lng,
    true
  );
  xmlHttp.setRequestHeader('Content-Type', 'application/json');
  xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
  xmlHttp.send();
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
