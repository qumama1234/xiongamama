// const roomController = require('../../model/room/controller')


const electron =require('electron');
const ipc=electron.ipcRenderer;

const createButton=document.getElementById('createRoomButton');


createButton.addEventListener('click',function(){
    var rent="";
    var building="";
    var address="";
    var roomNo="";
    var type="";
    if(!document.getElementById("rentID").value||!document.getElementById("buildingID").value||!document.getElementById("roomID").value||!document.getElementById("typeID").value){
        return alert('部分内容没有填写,无法创建房间')
   }else{
       rent=document.getElementById("rentID").value;
       building=document.getElementById("buildingID").value;
       roomNo=document.getElementById("roomID").value;
       type=document.getElementById("typeID").value;
       if(document.getElementById("otherAddress")){
           address=document.getElementById("otherAddress").value;
       }else{
           if(!document.getElementById("addressID").value){
                return alert('部分内容没有填写,无法创建房间')
           }else{
               address=document.getElementById("addressID").value
           }
       }
    //    var name=address+'_'+building+'栋'+roomNO;
       return ipc.send('createRoom',{building:building,address:address,roomNo:roomNo,rent:rent,deposit:rent,type:type})
   }
})

ipc.on('CreateRes',function(_,arg){
    localStorage.removeItem('selectedRoom');
    alert(JSON.stringify(arg._doc.address+arg._doc.building+arg._doc.roomNo)+'创建成功')
})

