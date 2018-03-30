import React from "react";
import { Button, TouchableHighlight, Text } from "react-native";
import { List } from "native-base";
import glamorous, { View } from "glamorous-native";
import { observable } from "mobx";
import { observer } from "mobx-react";

export default context => {
  const Title = require("components/Title").default(context);
  const Card = require("components/Card").default(context);
  const SectorModalList = require("components/SectorModalList").default(
    context
  );
  const sectorStore = observable({ show: false });

  const SectorItemView = glamorous.view({
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: "lightgrey",
    borderTopWidth: 1,
    padding: 6
  });

  const SectorItem = ({ sector, onSectorDelete }) => (
    <TouchableHighlight onPress={() => onSectorDelete(sector)}>
      <SectorItemView>
        <View>
          <Text>{sector}</Text>
        </View>
        <View>
          <Text>Delete</Text>
        </View>
      </SectorItemView>
    </TouchableHighlight>
  );

  const SectorList = ({ sectors, onSectorDelete }) => (
    <List>
      {sectors.map(sector => (
        <SectorItem
          key={sector}
          sector={sector}
          onSectorDelete={onSectorDelete}
        />
      ))}
    </List>
  );

  const Sectors = observer(
    ({ sectorStore, sectors, onSectorDelete, onNewSector }) => (
      <Card>
        <SectorModalList
          visible={sectorStore.show}
          onPress={sector => {
            onNewSector(sector);
            sectorStore.show = false;
          }}
          onRequestClose={() => {
            sectorStore.show = false;
          }}
        />
        <Card.Header>
          <Title>Sectors</Title>
          <Button
            title="Add"
            onPress={() => {
              sectorStore.show = true;
            }}
          />
        </Card.Header>
        <Card.Body>
          <View />
          {sectors.length ? (
            <SectorList sectors={sectors} onSectorDelete={onSectorDelete} />
          ) : (
            <Text>Please add the sector you want to work in .</Text>
          )}
        </Card.Body>
      </Card>
    )
  );
  return props => <Sectors sectorStore={sectorStore} {...props} />;
};
