const electron = require('electron');
const ipc = electron.ipcRenderer;

function editRoom() {
    var selectRoomData=JSON.parse(JSON.parse(localStorage.getItem('selectedRoom')))
    var water = document.getElementById('waterID').value;
    var electricity = document.getElementById('electricityID').value;
    var rent = document.getElementById('rentID').value;
    if (!rent||!electricity||!rent) {
        return alert('部分内容没有填写,无法办理入住')
    } else {
        return ipc.send('editRoomReq', {
            roomID: selectRoomData.id,
            water: water,
            electricity: electricity,
            rent: rent
        })
    }
}

ipc.on('editRoomRes', function (_, arg) {
    localStorage.removeItem('selectedRoom');
    alert(JSON.stringify(arg._doc) + '成功修改房间信息')
})