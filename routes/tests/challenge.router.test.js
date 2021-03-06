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

        it('-forbidden if not an admin', function(done){
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

	it('-forbidden if not an admin and mission is not specified', function(done){
		process.env['ADMIN'] = false;
	    agent
	    .post('/api/challenge')
	    .send({
	        objective: 'Test Challenge', 
	        summary: 'This is a test', 
	        conclusion: 'You completed the test', 
	        category: 'text', 
	        order: 1})
	    .expect(403)
	    .end(function(err, res){
	    	if(err) return done(err);
	       	expect(res.text).to.equal('You do not have access to this page');
	         	// console.log(res.body);
	        done();
        });
    })

    it('-forbidden if not an admin', function(done){
		Mission.create({
				title: 'Test Title 2',
				description: 'My second test mission',
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



   describe('Updates challenges', function(){
   	it('-forbidden if not an admin', function(done){
		process.env['ADMIN'] = false;
	    agent
	    .put('/api/challenge/1/update')
	    .send({
	        objective: 'Test Update', 
	        summary: 'This is a my new and improved challenge', 
	        conclusion: 'You completed the test', 
	        category: 'text', 
	        order: 1})
	    .expect(403)
	    .end(function(err, res){
	    	if(err) return done(err);
	       	expect(res.text).to.equal('You do not have access to this page');
	         	// console.log(res.body);
	        done();
        });
    })

    it("-forbidden if not an admin when updating challenge's mission", function(done){
	    agent
	    .put('/api/challenge/1/addToMission/3')
	    .expect(403)
	    .end(function(err, res){
	    	if(err) return done(err);
	       	expect(res.text).to.equal('You do not have access to this page');
	         	// console.log(res.body);
	        done();
        });
    })

    it("-forbidden if not an admin when updating challenge's old mission", function(done){
	    agent
	    .delete('/api/challenge/1/mission/3')
	    .expect(403)
	    .end(function(err, res){
	    	if(err) return done(err);
	       	expect(res.text).to.equal('You do not have access to this page');
	         	// console.log(res.body);
	        done();
        });
    })

    it('saves updates when admin is logged in', function(done){
		process.env['ADMIN'] = true;
	    agent
	    .put('/api/challenge/1/update')
	    .send({
	        objective: 'Test Update', 
	        summary: 'This is a my new and improved challenge', 
	        conclusion: 'You completed the test', 
	        category: 'text', 
	        order: 1})
	    .expect(200)
	    .end(function(err, res){
	    	if(err) return done(err);
	       	expect(res.body).to.be.instanceof(Object);
	        expect(res.body.objective).to.equal("Test Update")
	        done();
        });
    })

    it("updates new mission's numChallenges", function(done){
	    Mission.findById(3)
	    .then(mission => {
	    	mission.getChallenges()
	    	.then(challenges => {
	    		let filteredChallenges = challenges.filter(function(x){x.id === 1 ? true : false})
	    		let numChallenges = mission.numChallenges
	    		expect(numChallenges).to.equal(challenges.length)
	    		expect(filteredChallenges).to.have.length(0)
		    	agent
		    	.put('/api/challenge/1/addToMission/3')
			    .expect(200)
			    .end(function(err, res){
			    	if(err) return done(err);
			       	expect(res.body.numChallenges).to.equal(numChallenges + 1);
			         	// console.log(res.body);
			        done();
		        });
	    	})
	    })
    })

    it("adds association between challenge and new mission", function(done){
	    Mission.findById(3)
	    .then(mission => {
	    	mission.getChallenges()
	    	.then(challenges => {
	    		let filteredChallenges = challenges.filter(function(x){
	    			return x.id === 1})
	    		let numChallenges = mission.numChallenges
	    		expect(numChallenges).to.equal(challenges.length)
	    		expect(filteredChallenges).to.have.length(1)
	    		done()
	    	})
    	})
  })

    it("updates old mission's numChallenges", function(done){
	    Mission.findById(3)
	    .then(mission => {
	    	mission.getChallenges()
	    	.then(challenges => {
	    		let filteredChallenges = challenges.filter(function(x){x.id === 1 ? true : false})
	    		let numChallenges = mission.numChallenges
	    		expect(numChallenges).to.equal(challenges.length)
	    		expect(filteredChallenges).to.have.length(0)
		    	agent
		    	.delete('/api/challenge/1/mission/3')
			    .expect(200)
			    .end(function(err, res){
			    	if(err) return done(err);
			       	expect(res.body.numChallenges).to.equal(numChallenges - 1);
			         	// console.log(res.body);
			        done();
		        });
	    	})
	    })
    })

    it("removes association between challenge and old mission", function(done){
	    Mission.findById(3)
	    .then(mission => {
	    	mission.getChallenges()
	    	.then(challenges => {
	    		let filteredChallenges = challenges.filter(function(x){
	    			return x.id === 1})
	    		let numChallenges = mission.numChallenges
	    		expect(numChallenges).to.equal(challenges.length)
	    		expect(filteredChallenges).to.have.length(0)
	    		done()
	    	})
    	})
  })
})

   describe('Deletes challenges', function(){
   	it("-forbidden if not an admin", function(done){
   		process.env['ADMIN'] = false;
	    agent
	    .delete('/api/challenge/1')
	    .expect(403)
	    .end(function(err, res){
	    	if(err) return done(err);
	       	expect(res.text).to.equal('You do not have access to this page');
	         	// console.log(res.body);
	        done();
        });
    })

    it("successfully when an admin is logged in", function(done){
    	process.env['ADMIN'] = true;
	    agent
	    .delete('/api/challenge/1')
	    .expect(200)
	    .end(function(err, res){
	    	if(err) return done(err);
	       	Challenge.findById(1)
	       	.then(challenge => {
	       		expect(challenge).to.equal(null)
	       		done();
	       	})
        });
    })
   })
})