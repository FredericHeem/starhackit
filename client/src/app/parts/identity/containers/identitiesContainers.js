import { connect } from 'react-redux';
import IdentitiesView from '../views/identitiesView';
import actions from '../actions';

let identities = [
  {
    idName: "Basic Id",
    data: [
      {
        name: "First Name",
        value: "Justin"
      },
      {
        name: "Last Name",
        value: "Time"
      },
      {
        name: "Email",
        value: "justin.time@mai.com"
      },
      {
        name: "Address",
        value: "2 high road"
      }
    ],
    certificates: [
      {
        certifiedBy: "Post Office"
      }
    ]

}, {
    idName: "Travel Id",
    data: [
      {
        name: "First Name",
        value: "Justin"
      },
      {
        name: "Last Name",
        value: "Time"
      },
      {
        name: "Email",
        value: "justin.time@mai.com"
      },
      {
        name: "Passport Number",
        value: "1DARTY65"
      }
    ]
}]

const mapStateToProps = () => {
  return {
    identities: identities
  };
}

export default connect(mapStateToProps, actions)(IdentitiesView)
