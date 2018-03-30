import React from "react";
import { Button, Text } from "react-native";
import { observable } from "mobx";
import { observer } from "mobx-react";
import _ from "lodash";

export default context => {
  const Title = require("components/Title").default(context);
  const Card = require("components/Card").default(context);
  const SectorModalList = require("components/SectorModalList").default(
    context
  );
  const sectorStore = observable({ show: false });

  const Sector = observer(({ sectorStore, sector, onPress }) => (
    <Card>
      <SectorModalList
        visible={sectorStore.show}
        onPress={sector => {
          onPress(sector);
          sectorStore.show = false;
        }}
        onRequestClose={() => {
          sectorStore.show = false;
        }}
      />

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
