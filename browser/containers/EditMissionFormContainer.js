import { connect } from 'react-redux';
import EditMissionForm from '../components/EditMissionForm';
import { fetchMissions } from '../reducers/missions';
import { setUser } from '../reducers/user';

const mapStateToProps = ({ mission }) => ({ mission })

const mapDispatchToProps = (dispatch) => ({
  findMissions: function() {
    dispatch(fetchMissions())
  }
});

const EditMissionFormContainer = connect(mapStateToProps, mapDispatchToProps)(EditMissionForm);
export default EditMissionFormContainer;
