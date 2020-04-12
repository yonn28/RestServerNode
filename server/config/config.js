
//=======================
//Puerto
//=========================

process.env.PORT = process.env.PORT || 3000;

//=======================
//Vencimiento del token
//=========================
// 60 segundos
// 60

process.env.CADUCIDAD_TOKEN = 60*60*24*30 ;

//=======================
//SEED
//=========================
process.env.SEED =process.env.SEED || 'este-es-el-seed-desarrollo';

//=======================
//entorno
//=========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================
//base de datos
//=========================


let urlDB

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;


//==============================
//Google client id
//=========================                       

process.env.CLIENT_ID = process.env.CLIENT_ID || '165329719339-oasp6r0l2bor1s9laklgh03l9ibdlj8l.apps.googleusercontent.com';