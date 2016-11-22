import { connect } from 'react-redux';
//import { loadPuppies } from '../../action-creators';
import {SendVerification} from '../components/Verification';
import {Verify} from '../components/Verification';
import {fetchUser} from '../reducers/user';

//******** FIX TO BE IN ES6 LIKE WE"RE USED TO
const mapStateToProps = (state) => {
  return state
};

const mapDispatchToProps = (dispatch) => ({
    findUser: function (number){
    	dispatch(fetchUser(number))
    }
});

const SendVerificationContainer = connect(mapStateToProps, mapDispatchToProps)(SendVerification);
const VerifyContainer = connect(mapStateToProps, mapDispatchToProps)(Verify)
export SendVerificationContainer;
export VerifyContainer;