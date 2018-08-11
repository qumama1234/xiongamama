const mongoose = require('mongoose')
const Schema = mongoose.Schema
// var  uuidv4 = require('uuid/v4');

const roomSchema = new Schema({
  roomNo:{type:String,required:true},
  customer:{type:String},
  rent:{type:Number,required:true},
  deposit:{type:Number,required:true},
  rented:{type:Boolean,default:false},
  address:{type:String,required:true},
  building:{type:String,default:' '},
  water:{type:Number,required:true,default:0},
  electricity:{type:Number,required:true,default:0},
  type:{type:String,required:true,default:"单身公寓"}, //单身公寓 loft 厂房 店面
  id:{type:String,required:true,unique:true}
})

module.exports = roomSchema
