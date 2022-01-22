#include <iostream>
#include <thread>
#include <string>
#include "modules/udp.cpp"
#include "modules/serial.cpp"
#include "modules/toml11/toml.hpp"

using namespace std;

int main () {
  const auto data = toml::parse("./.env.toml");
  const char* SERIAL_DEVICE = toml::find<string>(data, "SERIAL_DEVICE").c_str();
  const int SERIAL_BAUDRATE = toml::find<int>(data, "SERIAL_BAUDRATE");
  const int UDP_PORT = toml::find<int>(data, "UDP_PORT");

  const char* UDP_HOST = "0.0.0.0";
  UdpSendSocket *socket = new UdpSendSocket(UDP_HOST, UDP_PORT);
  Serial *port = new Serial(SERIAL_DEVICE, SERIAL_BAUDRATE);

  while (1) {
    char* message = port->readData(1);
    // printf("message %s\n", message);
    socket->sendData(message);
    // this_thread::sleep_for(std::chrono::milliseconds(500));
  }

  return 0;
}
