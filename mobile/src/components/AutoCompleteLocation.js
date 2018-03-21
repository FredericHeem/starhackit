import React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { View } from "glamorous-native";
import _ from "lodash";

export default context => {
  const AutoComplete = require("components/AutoComplete").default(context);
  const getPlacesAutocompleteDebounce = _.debounce(getPlacesAutocomplete, 600);

  const store = observable({
    location: "",
    setLocation: action(location => {
      console.log("setLocation ", location);
      getPlacesAutocompleteDebounce(location);
      store.location = location;
    }),
    setSuggestion: action(async (suggestion, onLocation) => {
      console.log("setSuggestion ", suggestion);
      const location = suggestion.description;
      
      store.location = location;
      store.suggestions = [];
      onLocation(suggestion);
    }),
    suggestions: [],
    suggestionsLoading: false
  });

  async function getPlacesAutocomplete(location) {
    try {
      console.log("getPlacesAutocomplete ", location);
      store.suggestionsLoading = true;
      store.suggestions = await context.stores.core.geoLoc.getPlacesAutocomplete(
        location
      );
    } finally {
      store.suggestionsLoading = false;
    }
    console.log("getPlacesAutocomplete ", location, store.suggestions.length);
  }

  const AutoCompleteLocation = observer(({ store, onLocation }) => (
    <View>
      <AutoComplete
        store={store}
        suggestions={store.suggestions}
        loading={store.suggestionsLoading}
        onSuggestion={suggestion => store.setSuggestion(suggestion, onLocation)}
        onLocation={location => store.setLocation(location)}
      />
    </View>
  ));

  return props => <AutoCompleteLocation {...props} store={store} />;
};
