import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = (state) => (state)

const mapDispatchToProps = (dispatch) => ({

});


const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;
