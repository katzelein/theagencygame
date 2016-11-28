import { connect } from 'react-redux';
//import { loadPuppies } from '../../action-creators';
import {SendVerification} from '../components/Verification';
import {Verify} from '../components/Verification';
import {fetchUser} from '../reducers/user';
import {setPhoneNumber} from '../reducers/phoneNumber';

//******** FIX TO BE IN ES6 LIKE WE"RE USED TO
const mapStateToProps = ({phoneNumber}) => ({phoneNumber});

const mapDispatchToProps = (dispatch) => ({
    findUser: function (){
    	dispatch(fetchUser())
    },

    setNumber: function(number){
    	dispatch(setPhoneNumber(number))
    }

});

export const SendVerificationContainer = connect(mapStateToProps, mapDispatchToProps)(SendVerification);
export const VerifyContainer = connect(mapStateToProps, mapDispatchToProps)(Verify);
