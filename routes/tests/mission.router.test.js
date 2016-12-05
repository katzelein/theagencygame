const {expect} = require('chai');
const session = require('supertest-session')
const db = require('../../models');
const User = db.models.users
const Mission = db.models.missions
const Challenge = db.models.challenges
const app = require('../../app');
const supertest = require('supertest');
const request = supertest(app);
const seed = require('../../models/seed')
const express = require('express')
var testApp = require('../../testApp')
//var testSession = session(app);
var api = require('../')

const agent = supertest.agent(testApp);


describe('Mission routes', function(){

    before('Before testing mission routes, reseed the db', () => seed());

    // afterEach(function () {
    //   return db.sync({force: true});
    // });

    describe('GETs missions', function(){

    it('if admin is logged in', function(done){
      process.env['ADMIN'] = true;
          agent
          .get('/api/missions')
          //.set('Cookie', 'user=1234')
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);
            expect(res.body).to.be.instanceof(Array);
            expect(res.body).to.have.length(3);
            // console.log("RES.BODY.WALL ST: ", res.body[0])
            // console.log("RES.BODY.BROADWAY: ", res.body[1])
            // console.log("RES.BODY.GHA CHALLENGE: ", res.body[2])
            // console.log("RES.BODY.GHA CHALLENGE: ", res.body[2])
            // expect(res.body[2].challenges).to.have.length(5)
            // console.log(res.body);
            done();
          });
        })

    it('returns missions in order and returns associated challenges', function(done){
          agent
          .get('/api/missions')
          //.set('Cookie', 'user=1234')
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);
            expect(res.body[2].title).to.equal('Grace Hopper and the Missing Bone')
            expect(res.body[2].challenges).to.have.length(5)
            done();
          });
        })

    it('-sends error if not an admin', function(done){
      process.env['ADMIN'] = false;
        agent
        .get('/api/missions')
        .expect(403)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.text).to.equal('You do not have access to this page');
          // console.log(res.body);
          done();
        });
    })

  })
})