import { connect } from 'react-redux';
import AuthenticatedComponent from 'components/authenticatedComponent';

const mapStateToProps = (state) => ({
  authenticated: state.get('auth').get('authenticated')
});

export default connect(mapStateToProps)(AuthenticatedComponent)
