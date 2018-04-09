
This project is a playground to build a mobile app with React Native. 

This app can be [downloaded with Expo](https://expo.io/@fredericheem/starhackit)

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

The most recent version of this operation guide is available [here](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md).


# Features

* Facebook authentication.
* Tab, Stack and Drawer navigation 
* Maps, use geolocation google api to complete addresses. 
* Profile page.
* Settings page.


# Tech Stack

* react-native with Expo.
* react-navigation for the routing.
* mobx as a the state management.
* glamorous for the css solution.
* native-base for the set of components.


# Installation



## Configuration

Copy `secrets.exmaples.json` to `secrets.json` and fill the facebook appId and the google api key. Do not forget to enable the geolocation and places google API. 

Facebook authentication key hash for android:

keytool -list -printcert -jarfile android%2F\@instire%2Finstire-0398ae0e-3c2a-11e8-9fa6-0a580a782213-signed.apk | grep SHA1 | awk '{ print $2 }' | xxd -r -p | openssl base64