import { connect } from 'react-redux';
//import { loadPuppies } from '../../action-creators';
import App from '../components/App';

//******** FIX TO BE IN ES6 LIKE WE"RE USED TO
const mapStateToProps = function (state) {
  return state
};

const mapDispatchToProps = function (dispatch) {
  return {
    findUser: function () {
    	// onclick authenticate
   
    }
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;