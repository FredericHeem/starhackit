import _ from "lodash";

function distanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
    (Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.ceil(d);
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default function computeDistance(geo, geoLoc) {
  //console.log("geo ", geo)
  //console.log("geoLoc ", geoLoc)
  const { latitude, longitude } = _.get(geoLoc, "location.coords");
  if (!latitude || !geo) {
    return;
  }
  const [jobLat, jobLon] = geo.coordinates;
  const distance = distanceFromLatLonInKm(latitude, longitude, jobLat, jobLon);
  return `${distance} km`;
}
