import { connect } from 'react-redux';
import AppView from '../views/application';
import actions from '../../auth/actions';

const mapStateToProps = (state) => {
  return {
    authenticated: state.get('auth').get('authenticated')
  };
}

export default connect(mapStateToProps, actions)(AppView)
