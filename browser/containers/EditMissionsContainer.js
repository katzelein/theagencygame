import { connect } from 'react-redux';
//import { loadPuppies } from '../../action-creators';
import EditMissions from '../components/EditMissions';
import {fetchMissions} from '../reducers/missions';
import {setUser} from '../reducers/user';

//******** FIX TO BE IN ES6 LIKE WE"RE USED TO
const mapStateToProps = ({missions}) => ({missions})

const mapDispatchToProps = (dispatch) => ({
	findMissions: function (){
    	dispatch(fetchMissions())
    }
 });


const EditMissionsContainer = connect(mapStateToProps, mapDispatchToProps)(EditMissions);
export default EditMissionsContainer;