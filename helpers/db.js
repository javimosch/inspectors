require('es6-promise').polyfill();
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Build the connection string 
var dbURI = 'mongodb://root:root@ds059165.mongolab.com:59165/inspectors'; 

// Create the database connection 
mongoose.connect(dbURI); 

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 


///SCHEMAS
mongoose.model('User', { 
    email: String,
    userType: {type:String, default: 'admin'}, //admin client diag
    password: String,
    firstName:String,
    lastName:String,
    passwordSended:{type:Boolean,default:false},
    address:String, 
    tel: String,
    _orders:[{ type: Schema.Types.ObjectId, ref: 'Order' }],

    //DIAG
    postCode:String,
    department:String,
    region:String,
    city:String,
    diplomes:[],
    comission:Number,

    //CLIENT
    clientType: {type:String}, //(Landlord / Agency / Foncière)
    siret: String,
    discount: {type:Number,default:0},
    
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
});


mongoose.model('Order', { 
    _diag:{ type: Schema.Types.ObjectId, ref: 'User' },
    _client:{ type: Schema.Types.ObjectId, ref: 'User' },
    diags: Array,
    address:String, //may differ from client address
    info: Array,
    obs: String,
    diagStart: Date,
    diagEnd: Date,
    status: {type:String,default:'ordered'},
    price: Number,
//    time: String, //estimated time.
    fastDiagComm: {type:Number,default:0}, //
    pdfId: String,
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
});

/*
        status:
            - ordered //just created 
            - prepaid //client paid first. When upload pdf -> complete
            - delivered // PDF uploaded first. When client paid -> complete
            - complete
        */


exports.mongoose = mongoose;



























