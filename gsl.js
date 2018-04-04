const baseurl =
  'https://costa-platform-uat.com/locations/stores?countryCode=UK&';

function getStores(postalCode) {
  const request = new XMLHttpRequest();
  request.open('GET', baseurl + 'postalCode=' + postalCode, false);
  request.send(null);
  let gsl = document.getElementById('gsl');
  gsl.appendChild(document.createTextNode(request.responseText));
  return request.responseText;
}

const apiKey = 'AIzaSyDL8Bx9LKau7b2Xa0LG16aGd53kTdiHbfQ';
