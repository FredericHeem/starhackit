import React from "react";
import { TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { observer } from "mobx-react/native";
import moment from "moment";
import Icon from "@expo/vector-icons/MaterialIcons";
import styled from "styled-components/native";

const ModalContent = styled.View`
  background-color: ${props => props.theme.content.backgroundColor};
  padding: 0;
  justify-content: center;
  align-items: center;
`;

const ModalHeader = styled.View`
  background-color: ${props => props.theme.header.backgroundColor};
  width: 100%;
`;

const IconClose = styled.View`
  margin: 12px;
  align-items: flex-end;
`;

const DebitedDateView = styled.View`
  padding: 10px;
`;

const DateLabel = styled.Text`
  font-size: 18;
`;

const DateText = styled.Text`
  padding: 6px;
  font-size: 14;
`;

const AccountView = styled.View`
  padding: 10px;
`;

const AccountLabel = styled.Text`
  font-size: 12;
`;

const AccountName = styled.Text`
  font-size: 16;
`;

const AmountText = styled.Text`
  padding: 28px;
  font-size: 24;
`;

const DetailsText = styled.Text`
  padding: 20px;
  font-size: 16;
`;

const Box = styled.View`
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-color: ${props => props.theme.content.borderColor};
  border-width: 0.5;
  width: 100%;
`;

const duration = 500;

export default context => {
  const { formatter } = context;
  function Header({ onClose }) {
    return (
      <ModalHeader>
        <TouchableOpacity onPress={onClose}>
          <IconClose>
            <Icon size={40} name="close" />
          </IconClose>
        </TouchableOpacity>
      </ModalHeader>
    );
  }

  function DebitedOn({ debitedDate }) {
    return (
      <DebitedDateView>
        <DateLabel>Debited {moment(debitedDate).fromNow()}</DateLabel>
        <DateText>{moment(debitedDate).format("LLL")}</DateText>
      </DebitedDateView>
    );
  }

  function Account({ name }) {
    return (
      <AccountView>
        <AccountLabel>From Account</AccountLabel>
        <AccountName>{name}</AccountName>
      </AccountView>
    );
  }

  return observer(function Transaction({ data, visible, onClose }) {
    return (
      <Modal
        isVisible={visible}
        animationInTiming={duration}
        animationOutTiming={duration}
        backdropTransitionInTiming={duration}
        backdropTransitionOutTiming={duration}
      >
        <ModalContent>
          <Header onClose={onClose} />
          <Box>
            <AmountText>
              {formatter.currency(data.amount, data.currency)}
            </AmountText>
          </Box>
          <Box>
            <DetailsText>{data.details}</DetailsText>
          </Box>
          <Box>
            <DebitedOn debitedDate={data.debitedDate} />
          </Box>
          <Box>
            <Account name={data.accountId} />
          </Box>
        </ModalContent>
      </Modal>
    );
  });
};
