/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
//var mongoose = require('mongoose');
//var winston = require('winston');
//var index = require("../router/index");
var assert = require("assert"); // node.js core module

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(4)); // 4 is not present in this array so indexOf returns -1
    });
  });
});

describe('user',function(){
    describe('null user',function(){
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
    
    describe('insert user',function(){
        it('should return 200 and a json',function(done){
            request('http://localhost:8888')
                .get('/home/759347650777464')
                .expect(200, done);
                
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