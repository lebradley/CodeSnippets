const storesdata = require('./storeresultsample.json'); // runs synchronously,
const smallsample = require('./smallersample.json');
const stores = storesdata.stores;
const sample = smallsample.stores;

// Helper
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

// Get me some locations
const url =
  'https://costa-platform-staging.com/locations/v2/stores?latitude=51.5074&longitude=-0.118092&maxrec=0&radius=10';

let xmlHttp = createXMLHTTP(callback);
xmlHttp.open(
  'GET',
  baseGSLUrl + 'latitude=' + coords.lat + '&longitude=' + coords.lng,
  true
);
xmlHttp.send();

// Filter time
function getExpress(stores) {
  return stores.filter(s => {
    return s.storeType === 'COSTA EXPRESS';
  });
}

function getStores(stores) {
  return stores.filter(s => {
    return s.storeType === 'COSTA STORE';
  });
}

function getStoresByFacility(facility, storeList) {
  let facilityStores = [];
  let facSt = storeList.filter(s => {
    s.storeFacilities.filter(f => {
      if (f.name === facility && f.active === true) {
        facilityStores.push(s);
      }
    });
  });
  return facilityStores;
}

const disabledWCStores = getStoresByFacility('Disabled WC', stores);
console.log(
  'Disabled WC: ' +
    disabledWCStores.length +
    ' out of ' +
    stores.length +
    ' stores'
);
