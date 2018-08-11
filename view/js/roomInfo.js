const electron=require('electron');
const ipc=electron.ipcRenderer;
const moment=require('moment')


var roomInfo=JSON.parse(JSON.parse(localStorage.getItem('selectedRoom')))

ipc.send('reqRoomInfo',roomInfo)

ipc.on('resRoomInfo',function(_,roomInfo){
    var myRoomInfo=JSON.parse(roomInfo)
    if(myRoomInfo.customer){
        document.getElementById('customerInfo').innerHTML='当前合同内容:<br>'+myRoomInfo.customer.name+
        ' 电话号码：'+myRoomInfo.customer.phoneNo+'<br>'+
        ' 微信号：'+myRoomInfo.customer.wechat+'<br>'+
        ' 合约开始时间：'+moment(myRoomInfo.customer.startDate).format('l')+'<br>'+
        ' 合约签约结束时间：'+moment(myRoomInfo.customer.endDate).format('l')+'<br>'+
        ' 停车费：'+myRoomInfo.customer.parkingFee+'<br>'+
        ' 清理费：'+myRoomInfo.customer.cleaningFee+'<br>'+
        ' 管理费：'+myRoomInfo.customer.managementFee+'<br>'+
        ' 其他费用: '+myRoomInfo.customer.otherFee+'<br>'+
        ' 电费单价：'+myRoomInfo.customer.electricityUnit+'<br>'+
        ' 水费单价：'+myRoomInfo.customer.waterUnit+'<br>';
        creatTable(myRoomInfo.paymentList)
    }else{
        document.getElementById('customerInfo').innerHTML='并没有客户入住此间房间'
    }
})




function creatTable(data){
    var table = document.getElementById("paymentTable");
    $.each(data, function (i, item) {
        var payment = item._doc;
        var row = table.insertRow();
        var name = row.insertCell(0);
        var dueTime = row.insertCell(1);
        var money = row.insertCell(2);
        var water = row.insertCell(3);
        var ele = row.insertCell(4);
        var payed = row.insertCell(5);

        name.innerHTML = item.name;
        dueTime.innerHTML=moment(item.dueDate).format('l');
        money.innerHTML=item.money;
        if(item.newWater){
            water.innerHTML=item.newWater
        }else{
            water.innerHTML='无记录'
        }
        if(item.newElectricity){
            ele.innerHTML=item.newElectricity
        }else{
            ele.innerHTML='无记录'
        }
        if(item.payed==true){
            payed.innerHTML="已付款"
        }else{
            payed.innerHTML="还未付款"
        }
     })
}

{/* <th>账单名称</th>
<th>截止时间</th>
<th>付款金额</th>
<th>付款时水数字</th>
<th>付款时电数字</th> */}
















