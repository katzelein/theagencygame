import { connect } from 'react-redux';
import EditChallenges from '../components/EditChallenges';
import { fetchChallenges } from '../reducers/challenges';
import EditMissions from '../components/EditMissions';
import { fetchMissions } from '../reducers/missions';
import { setUser } from '../reducers/user';

const mapStateToProps = ({ challenges, missions }) => ({ challenges, missions })

const mapDispatchToProps = (dispatch) => ({
  findChallenges: function() {
    dispatch(fetchChallenges())
  },
  findMissions: function() {
    dispatch(fetchMissions())
  }
});

const EditChallengesContainer = connect(mapStateToProps, mapDispatchToProps)(EditChallenges);
export default EditChallengesContainer;
