#include <iostream>
#include <string>
#include "modules/udp.cpp"
#include "modules/ws.cpp"
#include "modules/mysql.cpp"
#include "modules/toml11/toml.hpp"

using namespace std;

int main () {
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
  MYSQL_RES* res = mysql->runQuery("INSERT INTO tachometer (rpm) values (1000)");

  while (1) {
    char *data = socket->recieveData(4096);
    // cout << "receiving: " << data << endl;
    wsServer->broadcast(data);

    char* query;
    sprintf(query, "INSERT INTO tachometer (rpm) values (%s)", data);
    MYSQL_RES* res = mysql->runQuery(query);
  }
  cout << "Finished." << endl;

  return 0;
}
