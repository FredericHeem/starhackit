import React, { createElement as h } from "react";
import { View } from "react-native";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import _ from "lodash";

export default (context, config = {}) => {
  _.defaults(config, {
    steps: []
  });

  const store = observable({
    steps: config.steps,
    index: 0,
    header: observer(config.header),
    controls: config.controls,
    reset: action(() => {
      store.index = 0;
    }),
    next: action(() => {
      if (store.index + 1 < store.steps.length) {
        store.index += 1;
      }
    }),
    previous: action(() => {
      if (store.index > 0) {
        store.index -= 1;
      }
    }),
    title: () => store.steps[store.index].title,
    active: () => store.steps[store.index],
    isLast: () => store.index + 1 === store.steps.length,
    isFirst: () => store.index === 0
  });

  const Wizard = observer(props => (
    <View>
      {store.header &&
        h(store.header, {
          title: store.title(),
          index: store.index,
          isFirst: store.isFirst(),
          isLast: store.isLast(),
          onNext: () => store.next(),
          onPrevious: () => store.previous(),
          nextAllowed:
            store.active().nextAllowed && store.active().nextAllowed(props)
        })}
      {store.active && h(store.active().content, { ...props, store })}
      {store.controls &&
        h(store.controls, {
          index: store.index,
          isFirst: store.isFirst(),
          isLast: store.isLast(),
          onNext: () => store.next(),
          onPrevious: () => store.previous(),
          nextAllowed:
            store.active().nextAllowed && store.active().nextAllowed(props)
        })}
    </View>
  ));

  return {
    store,
    View: Wizard
  };
};
