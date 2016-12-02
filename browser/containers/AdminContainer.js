import { connect } from 'react-redux';
//import { loadPuppies } from '../../action-creators';
import Admin from '../components/Admin';
import { fetchUser } from '../reducers/user';

//******** FIX TO BE IN ES6 LIKE WE"RE USED TO
const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => ({
  findUser: function() {
    dispatch(fetchUser())
  }

});

const AdminContainer = connect(mapStateToProps, mapDispatchToProps)(Admin);
export default AdminContainer;
