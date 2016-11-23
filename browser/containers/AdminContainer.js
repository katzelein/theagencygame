import { connect } from 'react-redux';
//import { loadPuppies } from '../../action-creators';
import Admin from '../components/Admin';

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

const AdminContainer = connect(mapStateToProps, mapDispatchToProps)(Admin);
export default AdminContainer;