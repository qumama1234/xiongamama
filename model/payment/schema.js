const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment =require('moment')

const paymentSchema = new Schema({
  name: {type:String,required: true},
  money: {type:Number,default:0},
  created_at: {type:Date,default:moment().startOf('day').format('l')},
  dueDate: {type:Date,default:moment().startOf('day').format('l')},
  customer: {type:String,required:true},
  id:{type:String,required:true,unique:true},
  handled:{type:Boolean,default:false},
  payed:{type:Boolean,default:false},
  newWater:{type:Number},
  newElectricity:{type:Number},
})

module.exports = paymentSchema

  // type: {
  //   type: String,
  //   default: "租金",
  //   enum: ["租金", "水费", '电费', '物业费', '停车费', '阿姨费']
  // },