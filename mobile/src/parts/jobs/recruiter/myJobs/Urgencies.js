import React from "react";
import { TouchableOpacity } from "react-native";
import { observable } from "mobx";
import { observer } from "mobx-react";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import glamorous, { Text } from "glamorous-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default () => {
  const UrgencyView = glamorous.view({
    width: 140,
    height: 140,
    margin: 20,
    alignItems: "center",
    justifyContent: "space-around",
    display: "flex"
  });

  const URGENCIES = [
    {
      when: "NOW",
      color: "red",
      onPress: ({ currentJob, onNext }) => {
        currentJob.map.set("start_date", moment().format());
        onNext();
      }
    },
    {
      when: "TODAY",
      color: "orange",
      mode: "time",
      date: moment()
        .format(),
      onPress: ({ urgency }) => {
        urgency.show = true;
      },
      onDatePicked: ({ date, currentJob, onNext, urgency }) => {
        urgency.show = false;
        currentJob.map.set("start_date", moment(date).format());
        onNext();
      }
    },
    {
      when: "TOMORROW",
      mode: "time",
      color: "green",
      date: moment()
        .add(1, "days")
        .format(),
      onPress: ({ urgency }) => {
        urgency.show = true;
      },
      onDatePicked: ({ date, currentJob, onNext, urgency }) => {
        urgency.show = false;
        currentJob.map.set(
          "start_date",
          moment(date)
            .add(1, "days")
            .format()
        );
        onNext();
      }
    },
    {
      when: "LATER",
      color: "blue",
      mode: "date",
      date: moment()
        .add(2, "days")
        .format(),
      onPress: ({ urgency }) => {
        urgency.show = true;
      },
      onDatePicked: ({ date, currentJob, onNext, urgency }) => {
        urgency.show = false;
        currentJob.map.set("start_date", moment(date).format());
        onNext();
      }
    }
  ];

  const store = observable(URGENCIES.map(u => ({ ...u, show: false })));

  const Urgency = observer(({ currentJob, urgency, onNext }) => (
    <TouchableOpacity
      onPress={() => urgency.onPress({ urgency, currentJob, onNext })}
    >
      <UrgencyView backgroundColor="white" width={100}>
        <Icon name="clock-o" size={60} color={urgency.color} />
        <Text fontSize={18} fontWeight="bold">
          {urgency.when}
        </Text>

        {urgency.mode && (
          <DateTimePicker
            date={new Date(urgency.date)}
            mode={urgency.mode}
            isVisible={urgency.show}
            onConfirm={date => {
              urgency.onDatePicked({ urgency, date, currentJob, onNext });
            }}
            onCancel={() => {
              urgency.show = false;
            }}
          />
        )}
      </UrgencyView>
    </TouchableOpacity>
  ));

  const UrgenciesView = glamorous.view({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around"
  });

  const Urgencies = observer(({ currentJob, onNext }) => (
    <UrgenciesView>
      {store.map(urgency => (
        <Urgency
          onNext={onNext}
          key={urgency.when}
          urgency={urgency}
          currentJob={currentJob}
        />
      ))}
    </UrgenciesView>
  ));

  return Urgencies;
};
