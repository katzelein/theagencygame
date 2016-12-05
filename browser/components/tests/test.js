import React from 'react';
import {createStore} from 'redux';
import {range, last} from 'lodash';

import chai, {expect} from 'chai';
import chaiEnzyme from 'chai-enzyme';
chai.use(chaiEnzyme());
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import faker from 'faker';

import Admin from '../Admin'
import EditMissions from '../EditMissions'
import EditChallenges from '../EditChallenges'

describe('Admin', () => {

  describe('Admin component', () => {

    let adminData, adminWrapper;
    beforeEach('Create <Admin /> wrapper', () => {
      adminData = {
        id: 10,
        username: 'dummyAdmin',
        phoneNumber: '+15555555510',
        isAdmin: true
      };
      adminWrapper = shallow(<Admin user={adminData}/>);
    });

    it('contains an h3 with "Admin Page" as the title', () => {
      expect(adminWrapper.find('h3')).to.have.html('<h3>Admin Page</h3>');
    });

    it('has two Material-UI tabs for viewing and editing missions and challenges', () => {
      expect(adminWrapper.find('Tab')).to.have.length(2);
    });
  });
});
