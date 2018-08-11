
const electron = require('electron');
const ipc = electron.ipcRenderer;
var totalPayment=0;
var selectedCustomerData=JSON.parse(localStorage.getItem('selectedCustomer'))
var selectPaymentData=JSON.parse(localStorage.getItem('selectedPayment'))

function editPayment() {
    //waterID,electricityID,rentID,cleanFeeID,managementFeeID,otherFeeID,parkingFeeID
    var water = document.getElementById('waterID').value;
    var electricity = document.getElementById('electricityID').value;
    var rent = document.getElementById('rentID').value;
    var cleanFee = document.getElementById('cleanFeeID').value;
    var managementFee = document.getElementById('managementFeeID').value;
    var otherFee = document.getElementById('otherFeeID').value;
    var parkingFee = document.getElementById('parkingFeeID').value;
    if (!rent||!electricity||!water||!cleanFee||!managementFee||!otherFee||!parkingFee) {
        return alert('部分内容没有填写,无法修改账单')
    } else {
        //clean up the localstorge 
         localStorage.removeItem('selectedPayment');
         localStorage.removeItem('selectedRoom');
         localStorage.removeItem('selectedCustomer');
        return ipc.send('editPaymentReq', {
            paymentID: selectPaymentData.id,
            roomID:selectedCustomerData.room,
            customerID:selectedCustomerData.id,
            oldWater:selectedCustomerData.water,
            oldElectricity:selectedCustomerData.electricity,
            water: water,
            electricity: electricity,
            rent: rent,
            cleanFee:cleanFee,
            managementFee:managementFee,
            otherFee:otherFee,
            parkingFee:parkingFee,
            waterUnit:selectedCustomerData.waterUnit,
            electricityUnit:selectedCustomerData.electricityUnit,
            money:totalPayment
        })
    }
}

function calulateFee(){
    //get all data
    var oldWater=selectedCustomerData.water;
    var oldElectricity=selectedCustomerData.electricity;
    var newWater=parseFloat(document.getElementById('waterID').value);
    var newElectricity=parseFloat(document.getElementById('electricityID').value);
    var rent=parseInt(document.getElementById('rentID').value);
    var cleanFee=parseInt(document.getElementById('cleanFeeID').value); 
    var managementFee=parseInt(document.getElementById('managementFeeID').value); 
    var otherFee=parseInt(document.getElementById('otherFeeID').value)
    var parkingFee=parseInt(document.getElementById('parkingFeeID').value)
    var waterFee=0;
    var electricityFee=0;
    //calulate that shit
    if(oldWater!=newWater){
        if(newWater<oldWater){
            alert('水费数据错误') 
        }else{
            waterFee=(newWater-oldWater)*selectedCustomerData.waterUnit
        }
    }
    document.getElementById('waterFeeInfo').innerHTML='当前水费:'+waterFee+"(每单元水"+selectedCustomerData.waterUnit+"元）";
    if(oldElectricity!=newElectricity){
        if(newElectricity<oldElectricity){
            alert('电费数据错误') 
        }else{
            electricityFee=(newElectricity-oldElectricity)*selectedCustomerData.electricityUnit
        }
    }
    document.getElementById('electricityFeeInfo').innerHTML='当前电费:'+electricityFee +"(每单元电"+selectedCustomerData.electricityUnit+"元）";
    totalPayment=waterFee+electricityFee+rent+cleanFee+managementFee+otherFee+parkingFee;
    document.getElementById('totalPaymentInfo').innerHTML='当前账单：'+totalPayment;
}


ipc.on('editRoomRes', function (_, arg) {
    alert(JSON.stringify(arg._doc) + '成功修改房间信息')
})