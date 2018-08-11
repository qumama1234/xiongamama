const electron = require('electron');
const url = require('url');
const path = require('path');
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const config = require('./config');
const moment=require('moment');

const roomController = require('./model/room/controller');
const customerController = require('./model/customer/controller');
const paymentConroller=require('./model/payment/controller');

mongoose.Promise = bluebird
mongoose.connect(config.mongo.url)

const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = electron;

let mainWindow;
let win;

app.on('ready', function () {
    //checking For Payment set up
    roomController.find({rented:true}).then(listOfRentedRoom=>{
        return listOfRentedRoom.forEach(function(eachRoom){
            customerController.find({room:eachRoom.id,currentCustomer:true}).then(customer=>{
                if(customer.length!=1){
                    return dialog.showErrorBox('Error!!!',customer[0])
                }else{
                    // console.log('auto gen paycheck',customer[0]);
                    return paymentConroller.find({customer:customer[0].id}).then(paymentList=>{
                        paymentList.sort({dueDate: -1 });
                        var today=moment().format('l')
                        var nextPayment=moment(paymentList[0].dueDate).add('1','months').format('l');
                        if(today>=nextPayment){
                           return paymentConroller.create({name:eachRoom.address+'-'+eachRoom.building+'栋-'+eachRoom.roomNo+'号住户'+nextPayment+'账单',customer:customer[0].id,dueDate:nextPayment})
                        }else{
                            return;
                        }
                    })
                }
            })
        })
    })

    //load main page
    mainWindow = new BrowserWindow({
        title: "熊阿姨私人租房管理软件",
        width: 1200,
        height: 1000
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'view/pages/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //function pool
    //create Room
    ipcMain.on('createRoom', function (event, arg) {
        roomController.create(arg).then(_ => {
            // ipcRenderer.sendSync('CreateRes',_);
            return event.sender.send('CreateRes', _)
        }).catch(err => {
            if (err.message.indexOf(' duplicate key error collection') > -1) {
                console.log(err.message)
                return dialog.showErrorBox('错误提示', '此房间已存在')
            } else {
                return dialog.showErrorBox('错误提示', err.message)
            }
        });
    })

    //get Room List
    ipcMain.on('getRoomList', function (event) {
        roomController.find({}).then(roomlist => {
            roomlist.sort( { rented: 1 } )
            return event.sender.send('roomList', roomlist)
        }).catch(err => {
            return dialog.showErrorBox('错误提示', err.message)
        })
    })

    ipcMain.on('getPaymentList',function(event){
        paymentConroller.find({payed:false}).then(paymentList=>{
            paymentList.sort({endDate:-1})
            return event.sender.send('paymentList',paymentList)
        }).catch(err=>{
            return dialog.showErrorBox('错误提示', err.message)
        })
    })

    //get Edit Room Page
    ipcMain.on('editRoom', function (event, data) {
        openWindow('editRoom')
    })

    //get liveIn Page
    ipcMain.on('liveIn', function (event, data) {
        openWindow('liveIn')
    })

    //get roomInfo Page
    ipcMain.on('roomInfo', function (event, data) {
        openWindow('roomInfo');
    })

    
    //get Info Page
    ipcMain.on('reqRoomInfo', function (event, data) {
        var allInfo={};
        if(data.rented==true){
            return customerController.find({room:data.id,currentCustomer:true}).then(customer=>{
                allInfo.customer=customer[0];
                return paymentConroller.find({customer:customer[0].id});
            }).then(listOfPayment=>{
                allInfo.paymentList=listOfPayment;
               return event.sender.send('resRoomInfo', JSON.stringify(allInfo));
            })
        }else{
            return event.sender.send('resRoomInfo', data);
        }
    })

    //get checkout Page
    ipcMain.on('checkOut', function (event, data) {
        var room=JSON.parse(JSON.parse(data))
        return customerController.find({room:room.id,currentCustomer:true}).then(currentCustomer=>{
            if(currentCustomer.length==1){
                return paymentConroller.find({customer:currentCustomer[0].id,payed:false}).then(restOfPayment=>{
                    if(restOfPayment.length!==0){
                        return dialog.showErrorBox('退房错误', '无法办理退房 请清除所有的账单');
                    }else{
                        return electron.dialog.showMessageBox({
                            type: 'info',
                            buttons: ['Yes', 'No'],
                            message: '是否确定已经处理好所有余款',
                        }, resp => {
                            if (resp === 0) {
                                return roomController.update(room.id,{
                                    rented:false
                                }).then(updatePayment => {
                                    if (updatePayment.ok == 1) {
                                        customerController.update(currentCustomer[0].id,{currentCustomer:false})
                                        return mainWindow.reload();
                                    } else {
                                        return dialog.showErrorBox('错误提示', '无法处理账单,找曾师傅')
                                    }
                                })
                            }
                        });
                    }
                })
            }else{
                return dialog.showErrorBox('错误提示', '无法正确的正确的住户,找曾师傅')
            }
        })
        // openWindow('checkOut')
    })

    //get input payment info page
    ipcMain.on('editPaymentPage',function(event,data){
        return customerController.find({id:data.customer}).then(customer=>{
            var returnInfo={}
            if(customer.length==1){
                returnInfo=customer[0]._doc
                return roomController.find({customer:returnInfo.id}).then(room=>{
                    if(room.length==1){
                        returnInfo.water=room[0].water;
                        returnInfo.electricity=room[0].electricity;
                        returnInfo.rent=room[0].rent;
                        event.sender.send('getSelectedCustomer', returnInfo)
                        return openWindow('editPayment')
                    }else{
                        return dialog.showErrorBox('错误提示', '无法正确的找到房间,找曾师傅')
                    }
                })
            }else{
                return dialog.showErrorBox('错误提示', '无法正确的找到顾客,找曾师傅')
            }
        })
    })

    // create customer contrcter
    ipcMain.on('customerLiveIn', function (event, data) {
        var myCustomer;
        //find right room
        roomController.find({
            id: data.roomID
        }).then(room => {
            if (room.length == 1) {
                return customerController.create({
                    name: data.name,
                    parking: data.parking,
                    phoneNo: data.phoneNo,
                    room: data.roomID,
                    endDate: moment().add(data.rentTime,'months').format('l'),
                    parkingFee:data.parkingFee,
                    otherFee:data.otherFee,
                    cleaningFee:data.cleaningFee,
                    electricityUnit:data.electricityUnit,
                    managementFee:data.managementFee,
                    waterUnit:data.waterUnit
                }).then(customer => {
                    myCustomer=customer;
                    return roomController.update(customer.room, {
                        rented: true,
                        customer: customer.id
                    }).then(updateRoom => {
                        if (updateRoom.ok == 1) {
                            var name =myCustomer.name+moment().format('l')+'账单';
                            return paymentConroller.create({name:name,customer:myCustomer.id}).then(_=>{
                                mainWindow.reload()
                                win.close()
                                return win=null;
                            })
                        }else{
                            return dialog.showErrorBox('错误提示', '无法办理入住,找曾师傅')
                        }
                    })
                }).catch(err => {
                    return dialog.showErrorBox('错误提示', err.message)
                })
            } else {
                return dialog.showErrorBox('错误提示', "找不到正确的房间")
            }
        })
    })

    // edit room
    ipcMain.on('editRoomReq',function(event,data){
        //find right room
        return roomController.update(data.roomID,{
            rent:data.rent,
            water:data.water,
            electricity: data.electricity
        }).then(updateRoom => {
            if (updateRoom.ok == 1) {
                mainWindow.reload()
                win.close()
                return win=null;
            } else {
                return dialog.showErrorBox('错误提示', '无法更新房屋信息,找曾师傅')
            }
        })
    })

    //edit payment info
    ipcMain.on('editPaymentReq',function(event,data){
        // console.log('editPaymentReq',data);
           return paymentConroller.update(data.paymentID,{
               money:data.money,
               newWater:data.water,
               newElectricity:data.electricity,
               handled:true
           }).then(updatePayment => {
            if (updatePayment.ok == 1) {
                mainWindow.reload()
                win.close()
                return win=null;
            } else {
                return dialog.showErrorBox('错误提示', '无法更新账单,找曾师傅')
            }
        })
    })

    //pay off 
    ipcMain.on('payoff',function(event,data){
        var message=data.name+' 客户付款';
        if(data.handled==false){
            message='你还没有处理过这个账单,是否确定客户已经正确的付款？'
        }
        message+='结账余额：'+data.money
        electron.dialog.showMessageBox({
            type: 'info',
            buttons: ['Yes', 'No'],
            message: message,
        }, resp => {
            if (resp === 0) {
                return paymentConroller.update(data.id,{
                    payed:true
                }).then(updatePayment => {
                    if (updatePayment.ok == 1) {
                        console.log('water:',data.newWater)
                        console.log('ele:',data.newElectricity)
                        return customerController.find({id:data.customer}).then(customer=>{
                            return roomController.update(customer[0].room,{electricity:data.newElectricity,water:data.newWater})
                        }).then(_=>{
                            if(_.ok==1){
                                return mainWindow.reload()
                            }else{
                                return dialog.showErrorBox('错误提示', '无法处理账单,找曾师傅')
                            }
                        })
                    } else {
                        return dialog.showErrorBox('错误提示', '无法处理账单,找曾师傅')
                    }
                })
            }
        });
    });
})

function openWindow(filename) {
    var file = 'view/pages/' + filename + '.html'
    var title;
    if (filename == 'liveInPage') {
        title = '入住登记';
    } else if (filename == 'editRoom') {
        title = '更改房间信息';
    } else if(filename=='roomInfo'){
        title='房间当前记录'
    }
    else {
        title = '熊阿姨私人管理软件'
    }
    win = new BrowserWindow({
        title: title,
        width: 800,
        height: 600,
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, file),
        protocol: 'file:',
        slashes: true
    }));
}