import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import { fetchUser } from '../reducers/user';
import { setUser } from '../reducers/user';
import { fetchUserData } from '../reducers/userData';
import { getUserData } from '../reducers/userData';

const mapStateToProps = ({ user, userData }) => ({ user, userData })

const mapDispatchToProps = (dispatch) => ({
  findUser: function() {
    dispatch(fetchUser())
  },
  logoutUser: function() {
    dispatch(setUser({}))
  },
  findUserData: function() {
    dispatch(fetchUserData())
  }
});


const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export default DashboardContainer;
