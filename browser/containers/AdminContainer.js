import { connect } from 'react-redux';
import Admin from '../components/Admin';
import { fetchUser } from '../reducers/user';

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => ({
  findUser: function() {
    dispatch(fetchUser())
  }
});

const AdminContainer = connect(mapStateToProps, mapDispatchToProps)(Admin);
export default AdminContainer;
