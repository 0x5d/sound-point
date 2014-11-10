/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var auxreq  = require("request");
//var mongoose = require('mongoose');
//var winston = require('winston');
var index = require("../router/index");
var assert = require("assert"); // node.js core module
var http = require('http');
http.post = require('http-post');


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
    
    describe('insert and remove user',function(){
        it('should return 200 and a json',function(done){
             var user = {
                    userId: '123prueba',
                    email: 'prueba',
                    username: 'prueba'
                }; 
            request('http://localhost:8888')
                .post('/register')
                .send(user)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if(err) {
                      done(err);
                    } else {
                        request('http://localhost:8888')
                        .post('/removeUser')
                        .send(user)
                        .expect(200)
                        .end(function(err, res){
                            if(err){
                                done(err);
                            }else{
                                done();
                            }
                        });
                        done();
                    }
                });
                
            });
    });
    describe('findUser',function(){
         var user =  JSON.stringify({
                    userId: '1234prueba',
                    email: 'prueba',
                    username: 'prueba'
                }); 
        before(function(done){
            
            http.post('http://localhost:8888/register',{userId: '1234prueba',
                    email: 'prueba',
                    username: 'prueba'}, function(res){
                console.log(res.body);
                done();
            });
            /*var options = {
                url: 'http://localhost:8888',
                path: '/register',
                method: 'POST',
                form:user
              };
            auxreq.post(options, function(err,res,body) {
                console.log(err);
                done();
            });*/
        });//
        it('should return 200 and be a json', function(done){ 
            request('http://localhost:8888')
                .get('/home/1234prueba')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});
