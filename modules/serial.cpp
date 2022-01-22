#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>
#include <termios.h>
#include <time.h>
#include <thread>

#define BUFF_SIZE 4096

using namespace std;

int openPort(const char* deviceName) {
  int fd = open(deviceName, O_RDWR | O_NONBLOCK );
  if (fd < 0) {
    printf("ERROR on device open\n");
    exit(1);
  }
  return fd;
}

void initPort(int port, int baudRate) {
  struct termios tio;
  memset(&tio, 0, sizeof(tio));
  tio.c_cflag = CS8 | CLOCAL | CREAD;
  tio.c_cc[VTIME] = 100;
  cfsetispeed(&tio, baudRate);
  cfsetospeed(&tio, baudRate);
  tcsetattr(port, TCSANOW, &tio);
}

void charcpy (char** dest, const char* target) {
  *dest = new char[strlen(target) + 1];
  strcpy(*dest, target);
}

class Serial {
  private:
    int port, fragmentLength, baudRate;
    char fragment[BUFF_SIZE];
    char* deviceName;

  public:
    Serial (const char* _deviceName, int _baudRate) {
      baudRate = _baudRate;
      charcpy(&deviceName, _deviceName);
      port = openPort(deviceName);
      initPort(port, baudRate);
      printf("%s is connected by %d bps\n", deviceName, baudRate);
      fragmentLength = 0;
    }

    // void send () {
    //
    // }

    char* readData (const int sleepTime = 1) {
      char buffer[BUFF_SIZE];
      char *returnValue = new char[BUFF_SIZE];
      returnValue[0] = 0;

      while (1) {
        int len = read(port, buffer, BUFF_SIZE); // 受信待ち
        if (len == 0) {
          this_thread::sleep_for(
            chrono::milliseconds(sleepTime)
          );
          continue;
        };

        if (len < 0) {
          printf("%s: READ ERROR\n", deviceName);
          exit(2);
        }

        for (int i=0; i<len; i++) {
          if (buffer[i] == '\n') {
            fragment[fragmentLength + 1] = 0;
            strcpy(returnValue, fragment);
            fragmentLength = 0;
          } else {
            fragment[fragmentLength] = buffer[i];
            fragmentLength++;
          }
        }
        if (returnValue[0] != 0) {
          return returnValue;
        }
      }
    }
};
//
// int main () {
//   struct Serial *port = new Serial(DEV_NAME, 9600);
//   while (1) {
//     char* data = port->readData();
//     printf("%s\n", data);
//   }
//
//   return 0; 
// };
