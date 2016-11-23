import { connect } from 'react-redux';
//import { loadPuppies } from '../../action-creators';
import Dashboard from '../components/Dashboard';

//******** FIX TO BE IN ES6 LIKE WE"RE USED TO
const mapStateToProps = ({user}) => ({user})

const mapDispatchToProps = (dispatch) => ({
  
 });


const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export default DashboardContainer;