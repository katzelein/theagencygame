import { connect } from 'react-redux';
import EditMissions from '../components/EditMissions';
import { fetchMissions } from '../reducers/missions';
import { setUser } from '../reducers/user';

const mapStateToProps = ({ missions }) => ({ missions })

const mapDispatchToProps = (dispatch) => ({
  findMissions: function() {
    dispatch(fetchMissions())
  }
});

const EditMissionsContainer = connect(mapStateToProps, mapDispatchToProps)(EditMissions);
export default EditMissionsContainer;
