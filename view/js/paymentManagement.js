const electron = require('electron');
const ipc = electron.ipcRenderer;
const moment=require('moment')

ipc.send('getPaymentList')

ipc.on('paymentList',function(_,paymentList){
    creatTable(paymentList)
})

ipc.on('getSelectedCustomer',function(_,customer){
    localStorage.setItem('selectedCustomer',JSON.stringify(customer));
})

function creatTable(data){
    var table = document.getElementById("paymentTable");
    $.each(data, function (i, item) {
        var payment = item._doc;
        var row = table.insertRow();
        var name = row.insertCell(0);
        var dueTime = row.insertCell(1);
        var rent = row.insertCell(2);
        var inputInfo = row.insertCell(3);
        var payOff = row.insertCell(4);

        name.innerHTML = payment.name;
        var dueDate=new Date(payment.dueDate)
        dueTime.innerHTML =getDate(dueDate);
        rent.innerHTML = payment.money+'元';

        row.setAttribute('class',passOrNotPass(dueDate))

        var inputInfoButton=document.createElement("BUTTON");
        var payoffButton=document.createElement("BUTTON");

        var span = document.createElement('span');
        var payOffSpan=document.createElement('span');

        inputInfoButton.setAttribute('class', 'btn btn-primary btn-sm active');
        payoffButton.setAttribute('class', 'btn btn-primary btn-sm active');
        
        inputInfoButton.onclick=function(){
            localStorage.setItem('selectedPayment',JSON.stringify(payment));
            ipc.send('editPaymentPage',payment)
        }

        payoffButton.onclick=function(){
            localStorage.setItem('selectedPayment',JSON.stringify(payment));

            //need a quick check
            ipc.send('payoff',payment)
        }

        inputInfo.setAttribute('type', 'button');
        payOff.setAttribute('type','button');
        if(!payment.handled){
            span.innerHTML = "首次输入账单信息";
        }else{
            span.innerHTML = "继续修改账单信息";
        }
        payOffSpan.innerHTML='确认付清';
        inputInfoButton.appendChild(span);
        inputInfo.appendChild(inputInfoButton);
        payoffButton.appendChild(payOffSpan);
        payOff.appendChild(payoffButton);
     })
}

function getDate(date){
    // var now=new Date()
    return date.getFullYear()+'年'+date.getMonth()+'月'+date.getDate()+'日'
}

function passOrNotPass(dueDate){
    var today=moment().format('l')
    var dueDate=moment(dueDate).format('l')
    if(today>dueDate){
        return 'danger'
    }else if(today<dueDate){
        return 'info'
    }else{
        return 'warning'
    }
}







