#include <iostream>
#include <string>
#include "modules/udp.cpp"
#include "modules/ws.cpp"
#include "modules/toml11/toml.hpp"

using namespace std;

int main () {
  const auto data = toml::parse("./.env.toml");
  const int UDP_PORT = toml::find<int>(data, "UDP_PORT");
  const int WS_PORT = toml::find<int>(data, "WS_PORT");

  UdpRecieveSocket *socket = new UdpRecieveSocket(UDP_PORT);
  WsServer *wsServer = new WsServer(WS_PORT);
  cout << "servinig udp and ws now" << endl;

  while (1) {
    char *data = socket->recieveData(4096);
    // cout << "receiving: " << data << endl;
    wsServer->broadcast(data);
  }
  cout << "Finished." << endl;

  return 0;
}
