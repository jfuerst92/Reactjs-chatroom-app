const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    console.log(data)
    if (data.startsWith("!nick")){
      ws.nick = data.substr(data.indexOf(' ')+1); // "tocirah sneab"

    }
    else if (data.startsWith("!online")){
      var nickList = []
      wss.clients.forEach(function each(client) {

        if (client.readyState === WebSocket.OPEN) {
          //client.send((ws.nick || 'anonymous') + ": " + data);
          nickList.push(client.nick)
          //console.log(nickList)

        }
      });
      var nickListJSON = {
        nicks: nickList
      }
      ws.send(JSON.stringify(nickListJSON))

    }
    else{
      wss.clients.forEach(function each(client) {

        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            message: '' + (ws.nick || 'anonymous') + ": " + data

          }));
        }
      });
    }
  });
  ws.on('close', function close() {
    console.log('disconnected');
  });

});
