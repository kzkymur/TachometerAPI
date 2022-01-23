#include <unistd.h>
#include <iostream>
#include <string>
#include <toml.hpp>
#include "modules/udp.cpp"
#include "modules/ws.cpp"
#include "modules/daemon.cpp"
#include "modules/mysql.cpp"

using namespace std;

int main (void) {
  daemonize(1);

  const auto data = toml::parse("./.env.toml");
  const int UDP_PORT = toml::find<int>(data, "UDP_PORT");
  const int WS_PORT = toml::find<int>(data, "WS_PORT");
  const char* MYSQL_HOST = toml::find<string>(data, "MYSQL_HOST").c_str();
  const char* MYSQL_USER = toml::find<string>(data, "MYSQL_USER").c_str();
  const char* MYSQL_PASSWD = toml::find<string>(data, "MYSQL_PASSWD").c_str();
  const char* MYSQL_DBNAME = toml::find<string>(data, "MYSQL_DBNAME").c_str();

  UdpRecieveSocket *socket = new UdpRecieveSocket(UDP_PORT);
  WsServer *wsServer = new WsServer(WS_PORT);
  cout << "servinig udp and ws now" << endl;

  MySQL* mysql = new MySQL(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWD, MYSQL_DBNAME);

  while (1) {
    char *data = socket->recieveData(4096);
    // cout << "receiving: " << data << endl;
    wsServer->broadcast(data);

    char query[1024];
    int int_data = atoi(data);
    if (0 < int_data && int_data < 20000) {
      sprintf(query, "INSERT INTO tachometer (rpm) values (%d)", int_data);
      mysql->runQuery(query);
    }
  }
  cout << "Finished." << endl;

  return 0;
}
