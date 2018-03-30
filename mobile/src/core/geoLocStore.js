import { observable } from "mobx";
import { Permissions, Location } from "expo";
import _ from "lodash";

export default context => {
  const store = observable({
    location: {},
    addresses: [],
    error: false,
    get: async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        store.error = true;
      } else {
        const location = await Location.getCurrentPositionAsync({});
        store.location = location;
        console.log("geo loc ", JSON.stringify(location));
        //const res = await store.getCity();
        //console.log(res);
        return location;
      }
    },
    getGeoPosition: async address => {
      const apiKey = context.secrets.googleMapKey;
      const buildGoogleUrl = ({ address }) =>
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
        try {
        const fetchRes = await fetch(
          buildGoogleUrl({
            address
          })
        );
        const res = await fetchRes.json();

        if (res.results) {
          console.log("getPlacesAutocomplete ", address, res.results);
          return res.results;
        }
        throw new Error(res);
      } catch (error) {
        console.log("getPlacesAutocomplete ", error);
        throw error;
      }
    },

    getPlacesAutocomplete: async place => {
      const apiKey = context.secrets.googleMapKey;

      const buildGoogleUrl = ({ place }) =>
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${place}&key=${apiKey}`;

      //console.log("getPlacesAutocomplete ");
      try {
        const fetchRes = await fetch(
          buildGoogleUrl({
            place
          })
        );
        const res = await fetchRes.json();

        if (res.predictions) {
          //console.log("getPlacesAutocomplete ", place, res.predictions.length);
          return res.predictions;
        }
        throw new Error(res);
      } catch (error) {
        console.log("getPlacesAutocomplete ", error);
        throw error;
      }
    },
    getCity: async () => {
      const buildGoogleUrl = ({ latitude, longitude, apiKey }) =>
        `https://maps.googleapis.com/maps/api/geocode/json?result_type=political|locality|sublocality|country&latlng=${latitude},${longitude}&key=${apiKey}`;

      const { coords } = store.location;
      console.log("getCity ", context.secrets);
      try {
        const res = await fetch(
          buildGoogleUrl({
            latitude: coords.latitude,
            longitude: coords.longitude,
            apiKey: context.secrets.googleMapKey
          })
        );
        const { results } = await res.json();
        //console.log("getCity", results.length);
        console.log("getCity", results);
        results.map(result =>
          console.log(
            "address_components ",
            result.address_components.map(addr => addr.long_name).join(" ** ")
          )
        );
        //results.map(result => console.log("formatted_address ", result.formatted_address))
        store.addresses = _.uniqBy(results, "formatted_address");
        //store.addresses = results;
        return results;
      } catch (error) {
        console.log("getCity ", error);
      }
    }
  });
  return store;
};
