import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios';

import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardText, CardHeader, CardTitle} from 'material-ui/Card'
import Toggle from 'material-ui/Toggle'

const styles = {
  card: {
    margin: 20,
    padding: 10,
    textAlign: 'left'
  },
  paper: {
    height: 500,
    width: 800,
    margin: 20
  },
};

const missions = [
  {
    status: 'completed',
    id: '27',
    title: 'Grace Hopper and the Missing Bone',
    numChallenges: '5',
    place: 'Grace Hopper Academy'
  },
  {
    status: 'completed',
    id: '4',
    title: 'Intrigue on Wall Street',
    numChallenges: '3',
    place: 'Wall Street'
  },
  {
    status: 'completed',
    id: '3',
    title: 'The Dark Underbelly of Broadway\'s Bright Lights',
    numChallenges: '4',
    place: 'Broadway'
  },
  {
    status: 'completed',
    id: '19',
    title: 'Fullstack\'s Disappearing Cereal',
    numChallenges: '2',
    place: 'Fullstack Academy'
  },
  {
    status: 'completed',
    id: '16',
    title: 'In the Shadow of the World Trade Center',
    numChallenges: '6',
    place: 'World Trade Center'
  },
  {
    status: 'completed',
    id: '31',
    title: 'Disappearance in Port Authority',
    numChallenges: '4',
    place: 'NYC Metro'
  },
  {
    status: 'incomplete',
    id: '9',
    title: 'The Case of the Closed Subway Station',
    numChallenges: '5',
    place: 'NYC Metro'
  },
];

const challenges = [
    { objective: 'Head to the Trump Building', // mission 1
      summary: 'We need photographic evidence of the specific street address assigned to this building. We believe that the etchings on the gold may somehow contain his fingerprints. When found, send photograph to this number. Show no others.',
      conclusion: 'Great work. The fingerprints are being to the lab for analysis. In the meantime, we have another task for you.',
    },
    { objective: 'Dine with the Finest', // mission 1
      summary: 'Cipriani on Wall St is as classy as it gets. Go to the restaurant and find out what the special of the day is.',
      conclusion: 'That does sound special. Might as well treat yourself to some grub while you are there'
    },
    { objective: 'Origins of the Open Market', // mission 1
      summary: 'According to our surveillance, agent SoAndSo bought an omelette with spinach and broccoli every morning at the Open Market. Head to the store and talk to Vinnie, the guy behind the omelette counter. Give him the passcode and, if he deems you trustworthy, send us his return passcode.', targetText: 'What are you talking about', 
      category: 'voice',
      conclusion: 'Vinnie may be connected to the mob. He trusted you with the right passcode, so our way deeper into the depths may be open. Please await your next mission.',
    }
]


export default class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.logout = this.logout.bind(this)
    this.handleExpand = this.handleExpand.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleExpandChange = this.handleExpandChange.bind(this)
    this.handleReduce = this.handleReduce.bind(this)
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

  handleExpandChange (expanded) {
    this.setState({expanded: expanded});
  };

  handleToggle (event, toggle) {
    this.setState({expanded: toggle});
  };

  handleExpand () {
    this.setState({expanded: true});
  };

  handleReduce () {
    this.setState({expanded: false});
  };

  render () {
    let missions = this.props.user.userMissions || []
    let user = this.props.user.user || ''
    let challenges = this.props.user.userChallenges || []

    return (
      <Card style={styles.card} expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title={<h2>{mission.title}</h2>}
          subtitle={mission.description}
          // actAsExpander={true}
          showExpandableButton={true}
          style={{margin: 20}} />
        <CardText>
          <Toggle
            toggled={this.state.expanded}
            onToggle={this.handleToggle}
            labelPosition="right"
            label="See this mission's challenges" />
        </CardText>
        <CardTitle title='Completed Challenges' expandable={true} />

          {challenges.map(function (challenge) { 
            return (
              <CardText expandable={true} key={challenge.order}>
                <h3>Summary </h3>
                <p>{challenge.summary} </p>
                <h3>Conclusion</h3>
                <p>{challenge.conclusion} </p>
              </CardText>
            )
          })}
      </Card>
    )
  }
}