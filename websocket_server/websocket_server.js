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
    else{
      wss.clients.forEach(function each(client) {

        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send((ws.nick || 'anonymous') + ": " + data);
        }
      });
    }
  });
});
