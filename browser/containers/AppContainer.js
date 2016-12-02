import { connect } from 'react-redux';
//import { loadPuppies } from '../../action-creators';
import App from '../components/App';

//******** FIX TO BE IN ES6 LIKE WE"RE USED TO
const mapStateToProps = (state) => (state)

const mapDispatchToProps = (dispatch) => ({

});


const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;
