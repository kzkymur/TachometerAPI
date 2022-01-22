#include <iostream>
#include <thread>
#include "modules/udp.cpp"

using std::this_thread::sleep_for;

int main () {
  const char* UDP_HOST = "0.0.0.0";
  UdpSendSocket *socket = new UdpSendSocket(UDP_HOST, 9002);

  int count = 1;
  while (1) {
    char message[10 + sizeof(char)];
    count++;
    std::sprintf(message, "%d", count);
    socket->sendData(message);
    sleep_for(std::chrono::milliseconds(500));
  }

  return 0;
}
