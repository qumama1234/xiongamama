const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment =require('moment')
const config=require('../../config');

const customerSchema = new Schema({
  name:{type:String,required:true},
  room:{type:String,required:true},
  phoneNo:{type:String,default:'No'},
  wechat:{type:String,default:'No'},
  startDate:{type:Date,required:true,default:moment().startOf('day').format('l')},
  endDate:{type:Date,required:true,default:moment().startOf('day').add('3','months').format('l')},
  id:{type:String,default:true,unique:true},
  cleaningFee:{type:Number,default:0},
  parkingFee:{type:Number,default:0},
  managementFee:{type:Number,default:0},
  otherFee:{type:Number,default:0},
  electricityUnit:{type:Number,default:config.fee.electricity},
  waterUnit:{type:Number,default:config.fee.water},
  currentCustomer:{type:Boolean,default:true}
})

module.exports = customerSchema
