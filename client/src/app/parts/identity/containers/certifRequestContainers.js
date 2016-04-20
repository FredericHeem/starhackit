import { connect } from 'react-redux';
import CertifRequest from '../components/certifRequestComponent';
import actions from '../actions';

let certifiers = [
  {
    name: "Barclays"
}, {
    name: "CitizenSafe"
},
{
    name: "Digidentity"
},
{
    name: "Experian"
},
{
    name: "Post Office"
},
{
    name: "Lloyds"
},
{
    name: "Royal Mail"
},
{
    name: "SecureIdentity"
}]

const mapStateToProps = () => {
  return {
    certifiers: certifiers
  };
}

export default connect(mapStateToProps, actions)(CertifRequest)
