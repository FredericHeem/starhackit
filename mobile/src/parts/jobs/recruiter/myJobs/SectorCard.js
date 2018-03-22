import React from "react";
import { Button, Text, Modal } from "react-native";
import { observable } from "mobx";
import { observer } from "mobx-react";
import _ from "lodash";

export default context => {
  const Title = require("components/Title").default(context);
  const Card = require("components/Card").default(context);
  const List = require("components/List").default(context);
  const sectorStore = observable({ show: false });

  const sectorItems = [
    "Bar - Restaurants - Clubs",
    "Catering - Events",
    "Construction"
  ];

  const Sector = observer(({ sectorStore, sector, onPress }) => (
    <Card>
      <Modal
        animationType="fade"
        transparent={false}
        visible={sectorStore.show}
        onRequestClose={() => {
          sectorStore.show = false;
        }}
      >
        <Title>Select a sector</Title>
        <List
          onPress={item => {onPress(item); sectorStore.show = false;}}
          onKey={item => item}
          items={sectorItems}
          renderItem={item => <Text>{item}</Text>}
        />
      </Modal>

      <Card.Header>
        <Title>Sector</Title>
        <Button
          title={sector ? "Edit" : "Add"}
          onPress={() => {
            sectorStore.show = true;
          }}
        />
      </Card.Header>
      <Card.Body style={{ zIndex: 1 }}>
        {_.isEmpty(sector) ? (
          <Text>What is the job sector?</Text>
        ) : (
          <Text>{sector}</Text>
        )}
      </Card.Body>
    </Card>
  ));

  return props => <Sector sectorStore={sectorStore} {...props} />;
};
