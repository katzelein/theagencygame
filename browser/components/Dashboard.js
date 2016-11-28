import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios';

import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardHeader, CardText, CardTitle} from 'material-ui/Card'
import Toggle from 'material-ui/Toggle'

const styles = {
  paper: {
    textAlign: 'center',
  }
};

const mission = {title: 'Grace Hopper and the Missing Bone',
      description: 'Ben, one of Grace Hopper Academy\'s proudest members, has had his favorite bone stolen out from under his nose. Can you identify the thief?',
      place: 'Grace Hopper',
      numChallenges: 5 }

const challenge = [{ objective: 'Find GHA\'s Newest Hero, Ceren',
      summary: 'Ceren, Ben\'s doting mom who, in an incredible feat of strength and love, pulled him from the grips of an oncoming subway just a few weeks ago, spends her days in the CSS room. Find her office where Ben\'s orange water bowl sits and send us a picture; we need a warrant to dust the bowl for fingerprints.',
      targetTags: ['bowl'],
      conclusion: 'Great work. We\'re picking up the scent of our thief; upcoming instructions to follow.' ,
      order: 1
    },
    { objective: 'Putting Out Kitchen Fires',
      summary: 'Ben loves to wander the hallways of Grace Hopper, finding the occasional student eager to scratch his belly, or scooping up the remains of a forgotten blueberry muffin. On the day of the theft, Ben was seen more than usual around the kitchen yesterday during an incoming shipment of cereal; we think this may be where the thief saw their opportunity. Please send the license number for the fire extinguisher on the left by the passcoded door. We believe the thief may use this as the passcode for their own office.',
      conclusion: 'You\'re on the mark, shouldn\'t be long now. Await further instructions',
      order: 2
    },
    { objective: 'Tracking the Teacher',
      summary: 'We have a list of all the offices linked to the passcode you found, and one of the teachers of Grace Hopper and Fullstack Academy, Ashi Krishnan, spent the day in the office implicated during the theft of Ben\'s bone. Find Ashi and find out the name of her childhood dog -- but do it covertly. She can\'t know that she\'s a suspect. Then call this number, speak the name of the dog when prompted, and quickly hang up. Secrecy is key.',
      conclusion: 'Ashi may not be the thief, but our progress has been strong. Well done, agent. The future looks bright.',
      order: 3
    },
    { objective: 'Grace Hopper Academy\'s Secret Storage',
      summary: 'We think that the thief may have an even bigger profile at the school than we thought possible. The corruption runs deep. The thief may have been so smart as to code a clue into the Grace Hopper logo in plain sight. Head to the lobby of the school and send us a picture of the logo.',
      targetTags: ['gha_logo'],
      conclusion: 'Our intel was correct; the logo contained vital information. One last step and we should be able to catch the thief red-handed.',
      order: 4
    },
    { objective: 'The Voice of Ultimate Betrayal',
      summary: 'This is where the rubber meets the road, agent. You will need to be your most stealthy. Find David Yang; he is never far away. Capture no more than 10 seconds of his voice to confirm his identity. We need to compare your footage to audio surveillance the Agency maintains for our own safety. Be careful.',
      conclusion: 'We have a match. David Yang is the thief of the missing bone. It is a dark day for Grace Hopper, but a proud day for the Agency. Well done, agent. Your country, and Ben, thanks you.',
      order:5
    }]



export default class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    // this.handleToggle.bind(this)
    // this.handleChange.bind(this)
    this.logout = this.logout.bind(this)
    // this.handleClick.bind(this)
  }

  componentDidMount () {
    this.props.findUser()
  }

  logout(){
    this.props.logoutUser()
    axios.post('/api/logout')
    .then(res => {
      console.log("logout res: ", res)
      browserHistory.push('/')
    })
  }

  // handleExpandChange = (expanded) => {
  //   this.setState({expanded: expanded});
  // };

  // handleToggle = (event, toggle) => {
  //   this.setState({expanded: toggle});
  // };

  // handleExpand = () => {
  //   this.setState({expanded: true});
  // };

  // handleReduce = () => {
  //   this.setState({expanded: false});
  // };



  render () {
    console.log("DASHBOARD USER: ", this.props.user)
    return (
      <div id="main">
        <Grid>
          <Row>
          <Paper style={styles.paper} zDepth={4} >
              {/* {this.props.user.id ? ( */}
                <div>
                  DASHBOARD



                  <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                    <CardHeader
                      title={mission.title + ', ' + mission.place}
                      subtitle={mission.description}
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText>
                      <Toggle
                        toggled={this.state.expanded}
                        onToggle={this.handleToggle}
                        labelPosition="right"
                        label="See this mission's challenges"
                      />
                    </CardText>

                    <CardTitle title={"Challenge" + challenge.order} subtitle={challenge.objective} expandable={true} />
                    <CardText expandable={true}>{challenge.conclusion}</CardText>


                  </Card>



                <div >
                  <RaisedButton label="Logout" onClick={this.logout} />
                </div>

                {/*  {this.props.user && this.props.user.isAdmin ?
                    (<div>
                      <Link to="/admin">Admin Page</Link>
                      </div>
                    ) :
                    null   
                  } */}          
                </div>{/*
              ) : (
                <div> Please <Link to="/">log in</Link> to view your dashboard </div>
              )
            } */}
          </Paper>
          </Row>
        </Grid>
      </div>
    );
  }
}