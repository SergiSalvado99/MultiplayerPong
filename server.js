var players = [];               

var connections = [];           

var b;                          

function Player(id,x,y,v,w,h,p){            
   this.id = id;
   this.x = x;
   this.y = y;
   this.w = w;
   this.h = h;
   this.points = p;
}

function Ball(id,x,y,xv,yv,r){              
  this.id = id;
  this.x = x;
  this.y = y;
  this.xv = xv;
  this.yv = yv;
  this.r = r;
}


var express = require('express');                   
var app = express();                                
var server = app.listen(3000);
app.use(express.static('public'));                  

console.log("Funciona");

var socket = require('socket.io');                  
var io = socket(server);                            


function getCounter(){                                          
	io.sockets.emit('getCounter',connections.length);          
	console.log("Hay " + connections.length + " usuarios conectados");                        
}

setInterval(refresh,33);                                        


function refresh(){                                              
	io.sockets.emit('refresh',players);
}

setInterval(refreshBall,33);                                      

function refreshBall(){                                           
	io.sockets.emit('refreshBall',b);
}


io.sockets.on('connection',function(socket){                         
	connections.push(socket);                                        
    getCounter();                                                   
    

	socket.on('start',function(data){                                                   
		var p = new Player(socket.id,data.x,data.y,data.w,data.h,data.points);
		players.push(p);                                                               
	}); 

	socket.on('startBall',function(data){                                               
		b = new Ball(socket.id,data.x,data.y,data.xv,data.yv,data.r);
	}); 

	socket.on('disconnect',function(data){                                                       
		connections.splice(connections.indexOf(socket),1);
		console.log("Un usuario se ha desconectado");
	});

	socket.on('update',function(data){                                                  
		var px;       
		for(var i = 0; i < players.length; i++){
			if(socket.id === players[i].id)
				px = players[i];
		}
		px.x = data.x;
		px.y = data.y;
		px.v = data.v;
		px.w = data.w;
		px.h = data.h;
		px.points = data.points;
	}); 

	socket.on('updateBall',function(data){                                            
		b.x = data.x;
		b.y = data.y;
		b.xv = data.xv;
		b.yv = data.yv;
		b.r = data.r;
	}); 

});