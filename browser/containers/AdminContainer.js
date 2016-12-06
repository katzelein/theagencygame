import { connect } from 'react-redux';
import Admin from '../components/Admin';
import { fetchUser } from '../reducers/user';
import { fetchChallenges } from '../reducers/challenges';
import { fetchMissions } from '../reducers/missions';

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => ({
  findUser: function() {
    dispatch(fetchUser())
  },
   findChallenges: function() {
    dispatch(fetchChallenges())
  },
  findMissions: function() {
    dispatch(fetchMissions())
  }
});

const AdminContainer = connect(mapStateToProps, mapDispatchToProps)(Admin);
export default AdminContainer;
