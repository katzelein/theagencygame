import { connect } from 'react-redux';
//import { loadPuppies } from '../../action-creators';
import Dashboard from '../components/Dashboard';
import {fetchUser} from '../reducers/user';
import {setUser} from '../reducers/user';

//******** FIX TO BE IN ES6 LIKE WE"RE USED TO
const mapStateToProps = ({user}) => ({user})

const mapDispatchToProps = (dispatch) => ({
	findUser: function (){
    dispatch(fetchUser())
  },
  logoutUser: function(){
    dispatch(setUser({}))
  }
});


const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export default DashboardContainer;