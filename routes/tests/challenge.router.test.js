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


describe('Challenge routes', function(){

    before('Before testing challenge routes, reseed the db', () => seed());

    // afterEach(function () {
    //   return db.sync({force: true});
    // });

    describe('GETs challenges', function(){

		it('if admin is logged in', function(done){
			process.env['ADMIN'] = true;
	        agent
	        .get('/api/challenges')
	        //.set('Cookie', 'user=1234')
	        .expect(200)
	        .end(function(err, res){
	          if(err) return done(err);
	          expect(res.body).to.be.instanceof(Array);
	          expect(res.body).to.have.length(8);
	          // console.log(res.body);
	          done();
        	});
        })

        it('returns challenges in order and includes associated mission', function(done){
          agent
          .get('/api/challenges')
          .expect(200)
          .end(function(err, res){
            if(err) return done(err);
            expect(res.body[7].id).to.equal(8)
            expect(res.body[7].mission.title).to.equal('Grace Hopper and the Missing Bone')
            done();
          });
        })

        it('-sends error if not an admin', function(done){
			process.env['ADMIN'] = false;
	        agent
	        .get('/api/challenges')
	        //.set('Cookie', 'user=1234')
	        .expect(403)
	        .end(function(err, res){
	          if(err) return done(err);
	          expect(res.text).to.equal('You do not have access to this page');
	          // console.log(res.body);
	          done();
        	});
    	})
  })

   describe('Creates challenges', function(){
   	it('if admin is logged in and assigns specified mission', function(done){
			process.env['ADMIN'] = true;
			Mission.create({
				title: 'Title',
				description: 'My test mission',
				place: 'Test Center',
				meetingPlace: "Mr. Fixit's Store",
				location: {type: 'Point', coordinates: [0, 0]}
			})
			.then(mission => {
				agent
	        	.post(`/api/challenge/setMission/${mission.id}`)
	        	.send({
	        		objective: 'Test Challenge', 
	        		summary: 'This is a test', 
	        		conclusion: 'You completed the test', 
	        		category: 'text', 
	        		order: 1})
	        	.expect(201)
	        	.end(function(err, res){
	          		if(err) return done(err);
	          			expect(res.body).to.be.instanceof(Object);
	          			expect(res.body.missionId).to.equal(mission.id.toString());
	          			// console.log(res.body);
	          			done();
        		});
			})
    })

    it('if admin is logged in and no mission specified', function(done){
			process.env['ADMIN'] = true;
			agent
	        .post('/api/challenge')
	        .send({
	        	objective: 'Test Challenge', 
	        	summary: 'This is a test', 
	        	conclusion: 'You completed the test', 
	        	category: 'text', 
	        	order: 1})
	        .expect(201)
	        .end(function(err, res){
	          	if(err) return done(err);
	          	expect(res.body).to.be.instanceof(Object);
	          	expect(res.body.missionId).to.equal(null);
	          	// console.log(res.body);
	          	done();
        	});
	})

	it('and saves it to the database', function(done){
		Challenge.findAll({})
		.then(challenges => {
			expect(challenges).to.have.length(10)
			done()
		})
	})
   })



   describe('Updates challenges', function(){
   	
   })

   describe('Deletes challenges', function(){
   	
   })
})