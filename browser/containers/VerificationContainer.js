import { connect } from 'react-redux';
//import { loadPuppies } from '../../action-creators';
import Verification from '../components/Verification';

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

const VerificationContainer = connect(mapStateToProps, mapDispatchToProps)(Verification);
export default VerificationContainer;