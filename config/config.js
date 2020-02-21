let env = process.env.NODE_Server, config;
let envNODE = process.env.NODE_ENV;
console.log('=======================================================');
console.log(`      current environment: ${JSON.stringify(envNODE)} / ${JSON.stringify(env)}`);
console.log('=======================================================');

if (env === 'awstest') {  
    config = {    
        system: {
            os: 'linux',
            rootFolder:'/root/userData'
        },   
        db: {
            host: '127.0.0.1',
            port: 27017,
            db: 'snoezelenTherapy'
        }
    }
} else if (env === 'frenkie') {
    config = {              
        system: {
            os: 'windows',
            rootFolder:__dirname + '\\..\\userData'
        },
        db: {
            host: '127.0.0.1',
            port: 27017,
            db: 'snoezelenTherapy'
        }
    }
} else if (env === 'hami') {  
    config = {       
        system: {
            os: 'linux',
            rootFolder:'/root/userData'
        },
        db: {
            host: '127.0.0.1',
            port: 27017,
            db: 'snoezelenTherapy'
        }
    }
}
else {  // development 開發環境   
    config = {     
        system: {
            os: 'linux',
            rootFolder:'/home/pi/userData'
        },  
        db: {
            host: '127.0.0.1',
            port: 27017,
            db: 'snoezelenTherapy'
        }
    }
}

module.exports = config;
