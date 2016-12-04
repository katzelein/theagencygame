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


describe('User routes', function(){

    before('Before testing user routes, reseed the db', () => seed());

    // afterEach(function () {
    //   return db.sync({force: true});
    // });

    describe('GETs users', function(){

		it('if admin is logged in', function(done){
			process.env['ADMIN'] = true;
	        agent
	        .get('/api/users')
	        .expect(200)
	        .end(function(err, res){
	          if(err) return done(err);
	          expect(res.body).to.be.instanceof(Array);
	          expect(res.body).to.have.length(7);
	          done();
        	});
        })

        it('-sends error if not an admin', function(done){
			process.env['ADMIN'] = false;
	        agent
	        .get('/api/users')
	        //.set('Cookie', 'user=1234')
	        .expect(403)
	        .end(function(err, res){
	          if(err) return done(err);
	          expect(res.text).to.equal('You do not have access to this page');
	          // console.log(res.body);
	          done();
        	});
    	})

      // it('by order id', function(done){
      //   agent.get('/api/order/1')
      //   .expect(200)
      //   .end(function(err, res){
      //     if(err) return done(err);
      //     expect(res.body.userType).to.be.equal('user');
      //     expect(res.body.user).to.be.equal(1);
      //     expect(res.body.status).to.be.equal('pending');
      //     done()
      //   });
      // });

      // it('by user id and pending status', function(done){
      //   agent
      //   .get('/api/order/user/pending/1')
      //   .expect(200)
      //   .end(function(err, res){
      //     if(err) return done(err);
      //     expect(res.body).to.be.instanceof(Array);
      //     expect(res.body).to.have.length(1);
      //     // console.log(res.body);
      //     expect(res.body[0].user).to.be.equal(1);
      //     done();
      //   })
      // })

      // it('by user id and completed status', function(done){
      //   agent
      //   .get('/api/order/user/completed/1')
      //   .expect(200)
      //   .end(function(err, res){
      //     if(err) return done(err);
      //     expect(res.body).to.be.instanceof(Array);
      //     expect(res.body).to.have.length(1);
      //     // console.log(res.body);
      //     done();
      //   })
      // })

      // it('by session id (not logged in)', function(done){
      //   agent
      //   .get('/api/order/session/1')
      //   .expect(200)
      //   .end(function(err, res){
      //     if(err) return done(err);
      //     expect(res.body).to.be.instanceof(Object);
      //     expect(res.body.userType).to.be.equal('session');
      //     expect(res.body.user).to.be.equal(1);
      //     expect(res.body.status).to.be.equal('pending');
      //     // console.log(res.body);
      //     done();
      //   })
      // })
  })
})