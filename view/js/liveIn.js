const electron = require('electron');
const ipc = electron.ipcRenderer;



function liveIn() {
    var name = "";
    var phoneNo = "";
    var wechat = "";
    var rentTime = "";
    var parkingFee=0;
    var managementFee=0;
    var electricityUnit=0;
    var waterUnit=0;
    var otherFee=0;

    if (!document.getElementById("name").value) {
        return alert('部分内容没有填写,无法办理入住')
    } else {
        name = document.getElementById("name").value;
        phoneNo = document.getElementById("phoneNo").value;
        wechat = document.getElementById("wechat").value;
        rentTime = document.getElementById("rentingTime").value;
        if(document.getElementById('parking').check){
            parkingFee = document.getElementById('parkingFee').value;
        }
        cleaningFee=document.getElementById('cleaningFee').value;
        managementFee=document.getElementById('managementFee').value;
        electricityUnit=document.getElementById('eleUnit').value;
        waterUnit=document.getElementById('waterUnit').value;
        otherFee=document.getElementById('otherFee').value;
        //clean up the localstorge 
        localStorage.removeItem('selectedRoom');
        localStorage.removeItem('selectedCustomer');
        return ipc.send('customerLiveIn', {
            roomID: selectRoomData.id,
            name: name,
            phoneNo: phoneNo,
            wechat: wechat,
            rentTime: rentTime,
            parkingFee:parkingFee,
            otherFee:otherFee,
            cleaningFee:cleaningFee,
            electricityUnit:electricityUnit,
            waterUnit:waterUnit,
            cleaningFee:cleaningFee,
            managementFee:managementFee
        })
    }
}

ipc.on('liveInRes', function (_, arg) {
    alert(JSON.stringify(arg._doc) + '办理入住成功')
})