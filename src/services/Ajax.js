"use strict";

const request = require('request');

/**
 * Ajax Promised Based Functions
 * 
 * FOR GET
    ajax.setOptions({
        uri: 'URL_GOES_HERE',
        //OTHER STANDARD HTTP OPTIONS GOES HERE
    }).get().then(data=>{
        //data contains...
            //data.response
            //data.body
        console.log(data);
    }).catch(error=>{
        console.log(error);
    });
 * FOR POST,PUT,DELETE
    //sample data to post, put or delete
    let data = {
        name: 'John Doe',
        age: 30
    };
    ajax.setOptions({
        uri: 'URL_GOES_HERE',
        //OTHER STANDARD HTTP OPTIONS GOES HERE
    })
    //change method accordingly, (post, put, delete)
    .post(data).then(data=>{
        //data contains...
            //data.response
            //data.body
        console.log(data);
    }).catch(error=>{
        console.log(error);
    });

 */

let ajax = {
    options: {},
    post : (data)=>{
        this.options.json = true;
        this.options.body = data;
        return new Promise((resolve, reject) => {
            console.log(this.options);
            request.post(this.options, (err, response, body) => {
                if(!err){
                    resolve({
                        response: response,
                        body: body
                    });
                }else{
                    reject({
                        error: err,
                        response: response
                    });
                }
            });
        });
    },
    put: (data) =>{
        this.options.json = true;
        this.options.body = data;
        return new Promise((resolve, reject) => {
            request.put(this.options, (err, response, body) => {
                if(!err){
                    resolve({
                        response: response,
                        body: body
                    });
                }else{
                    reject({
                        error: err,
                        response: response
                    });
                }
            });
        });
    },
    delete: () => {
        return new Promise((resolve, reject) => {
            request.delete(this.options, (err, response, body) => {
                if(!err){
                    resolve({
                        response: response,
                        body: body
                    });
                }else{
                    reject({
                        error: err,
                        response: response
                    });
                }
            });
        });
    },
    get: () => {
        return new Promise((resolve, reject) => {
            request.get(this.options, (err, response, body) => {
                if(!err){
                    resolve({
                        response: response,
                        body: body
                    });
                }else{
                    reject({
                        error: err,
                        response: response
                    });
                }
            });
        });
    },

    setOptions: (args) => {
        this.options = args;
        return ajax;
    },

    getOptions: () => {
        return this.options;
    }
};

module.exports = ajax;