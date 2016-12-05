const request = require('supertest-as-promised');
const {expect} = require('chai');
const db = require('../../models');
const Mission = require('../../models/mission');
const User = require('../../models/user');
const Challenge = require('../../models/challenge')
const app = require('../../app');
const supertest = require('supertest');
const agent = supertest.agent(app);


describe('Orders routes', function(){

  var items = [
      {name: "Anti Gravity Hat", description: "Ruin a gentleman's day by making his hat fly away!", price: 11, inventory: 20},
      {name: "Aviatomobile", description: "A flying toy car", price: 12, inventory: 23},
      {name: "Headless Hats", description: "Make the wearer's head invisible (along with the hat itself).", price: 17, inventory: 40},
    ];

    before(function () {
      return db.sync({force: true});
    });

    // afterEach(function () {
    //   return db.sync({force: true});
    // });

    describe('GETs orders', function(){
      var theOrder;

      //create an order instance
      beforeEach(function() {
        var ordArray = [
          {
            user: 1,
            userType: 'user'
          },
          {
            user: 1,
            userType: 'user',
            status: 'completed'
          },
          {
            user: 2,
            userType: 'user'
          },
          {
            user: 1,
            userType: 'session'
          }
        ];

        return Order.bulkCreate(ordArray);

      });

      xit('by user id (logged in)', function(done){
        agent
        .get('/api/order/user/1')
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(2);
          // console.log(res.body);
          done();
        });
      });

      xit('by order id', function(done){
        agent.get('/api/order/1')
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body.userType).to.be.equal('user');
          expect(res.body.user).to.be.equal(1);
          expect(res.body.status).to.be.equal('pending');
          done()
        });
      });

      xit('by user id and pending status', function(done){
        agent
        .get('/api/order/user/pending/1')
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(1);
          // console.log(res.body);
          expect(res.body[0].user).to.be.equal(1);
          done();
        })
      })

      xit('by user id and completed status', function(done){
        agent
        .get('/api/order/user/completed/1')
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.be.instanceof(Array);
          expect(res.body).to.have.length(1);
          // console.log(res.body);
          done();
        })
      })

      xit('by session id (not logged in)', function(done){
        agent
        .get('/api/order/session/1')
        .expect(200)
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).to.be.instanceof(Object);
          expect(res.body.userType).to.be.equal('session');
          expect(res.body.user).to.be.equal(1);
          expect(res.body.status).to.be.equal('pending');
          // console.log(res.body);
          done();
        })
      })


    })