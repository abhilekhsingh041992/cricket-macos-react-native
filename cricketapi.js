/**
 * Created by abhilekhsingh041992 on 4/18/17.
 */
var https = require('https');
var util = require('util');
var querystring= require('querystring');
var zlib = require('zlib');


var APP_ID = '12345',
    ACCESS_KEY = 'c1cd77dc86e6c691dfde1903a228e24f',
    SECRET_KEY = 'dfda668dc5e21adece05250ce2e7348e',
    DEVICE_ID = 'abr344mkd99';

var API_HOST = 'rest.cricketapi.com',
    API_PORT = 443,
    API_PREFIX = '/rest/v2/';

var access_token = null;

function auth(onAuth){

    var data = util.format(
        'access_key=%s&secret_key=%s&app_id=%s&device_id=%s',
        ACCESS_KEY, SECRET_KEY, APP_ID, DEVICE_ID);

    var post = {
        host: API_HOST,
        port: API_PORT,
        path: API_PREFIX + 'auth/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };

    var req = https.request(post, function(res){
        res.setEncoding('utf8');
        res.on('data', function(result){
            onAuth.call(undefined, JSON.parse(result));
        });
    });

    req.write(data);
    req.end();
}

function callAPI(url, params, onResult){

    if(!params){
        params = {};
    }
    if( ! params.access_token){
        params['access_token'] = access_token;
    }

    var query = querystring.stringify(params);

    var getParams = {
        host: API_HOST,
        port: API_PORT,
        path: API_PREFIX + url + '?' + query,
        method: 'GET',
        headers: {
            'accept-encoding': "gzip"
        }
    };

    var req = https.request(getParams, function(res){
        // res.setEncoding('utf8');

        var chunks = [];
        res.on('data', function(chunk) {
            chunks.push(chunk);
        });

        res.on('end', function(){
            var buffer = Buffer.concat(chunks);
            var encoding = res.headers['content-encoding'];
            if (encoding == 'gzip') {
                zlib.gunzip(buffer, function(err, result) {
                    result = result.toString();
                    onResult.call(undefined, JSON.parse(result));
                });
            }else{
                onResult.call(undefined, JSON.parse(buffer));
            }
        });
    });

    // req.write(data);
    req.end();
}

function getMatch(key, onResult){
    callAPI('match/' + key + '/', null, onResult);
}

function getSeasons(onResult){
    callAPI('recent_seasons/' , null, onResult);
}


auth(function(result){
    if(result.auth && result.auth.access_token){
        access_token = result.auth.access_token;

        getSeasons(function(response){
            console.log('Got match response for:- ', response);
        });

        getMatch('iplt20_2013_g30', function(match){
            console.log('Got match response for:- ', match.data.card.title);
        });
    }else{
        console.log(result);
        console.log('Auth failed.');
    }
});