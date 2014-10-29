/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var should ;//= require('should'); 
var assert ;//= require('assert');
var request ;//= require('supertest');  
//var mongoose = require('mongoose');
//var winston = require('winston');
//var index = require("../router/index");
var assert ;//= require("assert"); // node.js core module
define(function (require) {
     should = require('should');
     assert = require('assert');
     request = require('supertest');
     assert = require('assert');
});
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(4)); // 4 is not present in this array so indexOf returns -1
    });
  });
});

describe('user',function(){
    describe('finding home of null user',function(){
        it('should return 404', function(done){
            request('http://localhost:8888')
                .get('/home/null')
                .expect(404)
            .end(function(err, res){
                if (err) return done(err);
                done();
            });
        });
    });
    
    describe('insert nad remove user',function(){
        it('should return 200 and a json',function(done){
             var user = {
                    userId: '123prueba',
                    email: 'prueba',
                    username: 'prueba'
                }; 
            request('http://localhost:8888')
                .post('/register')
                .send(user)
                .expect(200)
                .end(function(err, res){
                if(err) {
                  done(err);
                } else {
                    //todo request eliminar
                }
      });
                
            });
    });
    describe('findUser',function(){
        it('should return 200 and be a json', function(done){
            request('http://localhost:8888')
                .get('/home/759347650777464')
                .expect(200, done);
        });
    });
});
