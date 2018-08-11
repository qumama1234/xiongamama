const electron=require('electron');
const ipc=electron.ipcRenderer;


ipc.send('getRoomList')

ipc.on('roomList',function(_,roomList){
    creatTable(roomList)
})

function creatTable(data){
    var table = document.getElementById("roomTable");
    $.each(data, function (i, item) {
        var inputData=JSON.stringify(JSON.stringify(item._doc))
        var row = table.insertRow();
        var address = row.insertCell(0);
        var buiding = row.insertCell(1);
        var roomNumber = row.insertCell(2);
        var type = row.insertCell(3);
        var rent = row.insertCell(4);
        var liveIn = row.insertCell(5);
        var checkout = row.insertCell(6);
        var editRoom = row.insertCell(7);
        var roomInfo = row.insertCell(8);

        address.innerHTML = item._doc.address;
        buiding.innerHTML = item._doc.building+'栋';
        roomNumber.innerHTML = item._doc.roomNo+'号';
        type.innerHTML = item._doc.type;
        rent.innerHTML = item._doc.rent+'元';

        var liveInButton=document.createElement("BUTTON");
        var checkOutButton=document.createElement("BUTTON");
        var editRoomButton=document.createElement("BUTTON");
        var roomInfoButton=document.createElement("BUTTON");

        var span = document.createElement('span');
        var checkOutSpan=document.createElement('span');
        var editRoomSpan=document.createElement('span');
        var roomInfoSpan=document.createElement('span');

        if(item._doc.rented){
            liveInButton.setAttribute('class', 'btn btn-primary btn-sm disabled');
            liveInButton.disabled=true;
            checkOutButton.setAttribute('class', 'btn btn-primary btn-sm active');
        }else{
            liveInButton.setAttribute('class', 'btn btn-primary btn-sm active');
            checkOutButton.setAttribute('class', 'btn btn-primary btn-sm disabled');
            checkOutButton.disabled=true;
        }
        editRoomButton.setAttribute('class', 'btn btn-primary btn-sm active');
        roomInfoButton.setAttribute('class','btn btn-primary btn-sm active');
        
        liveInButton.onclick=function(){
            localStorage.setItem('selectedRoom',inputData);
            ipc.send('liveIn',inputData)
        }
        checkOutButton.onclick=function(){
            localStorage.setItem('selectedRoom',inputData);
            ipc.send('checkOut',inputData)
        }
        editRoomButton.onclick=function(){
            localStorage.setItem('selectedRoom',inputData);
            ipc.send('editRoom',inputData)
        }
        roomInfoButton.onclick=function(){
            localStorage.setItem('selectedRoom',inputData);
            ipc.send('roomInfo',inputData)
        }

        liveIn.setAttribute('type', 'button');
        span.innerHTML = "登记入住";
        liveInButton.appendChild(span);
        liveIn.appendChild(liveInButton);

        checkout.setAttribute('type', 'button');
        checkOutSpan.innerHTML = "客户退房";
        checkOutButton.appendChild(checkOutSpan);
        checkout.appendChild(checkOutButton);

        editRoom.setAttribute('type', 'button');
        editRoomSpan.setAttribute('class', 'glyphicon glyphicon-pencil');
        editRoomSpan.innerHTML = "修改";
        editRoomButton.appendChild(editRoomSpan);
        editRoom.appendChild(editRoomButton);

        roomInfo.setAttribute('type', 'button');
        roomInfoSpan.innerHTML = "房间信息";
        roomInfoButton.appendChild(roomInfoSpan);
        roomInfo.appendChild(roomInfoButton);
     })
}



