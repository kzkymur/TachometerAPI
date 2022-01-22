#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <netdb.h> 

struct hostent* getHostByName(const char* hostname) {
  struct hostent *server;
  server = gethostbyname(hostname);
  if (server == NULL) {
    fprintf(stderr,"ERROR, no such host as %s\n", hostname);
    exit(0);
  }
  return server;
}

struct sockaddr_in fetchAddress(struct hostent* server, int port) {
  struct sockaddr_in serveraddr;

  bzero((char *) &serveraddr, sizeof(serveraddr)); // メモリの 0 padding
  serveraddr.sin_family = AF_INET;
  bcopy((char *)server->h_addr, 
      (char *)&serveraddr.sin_addr.s_addr, server->h_length);
  serveraddr.sin_port = htons(port);
  return serveraddr;
}

void send(const struct sockaddr_in address, int socket, char message[]) {
  int serverlen = sizeof(address);
  int n = sendto(socket, message, strlen(message), 0, (struct sockaddr *)&address, serverlen);
  if (n < 0) {
    perror("ERROR in sendto");
    exit(0);
  }
}

struct sockaddr_in constructAddress(int port) {
  struct sockaddr_in servaddr;
  memset(&servaddr, 0, sizeof(servaddr));

  // Filling server information
  servaddr.sin_family = AF_INET; // IPv4
  servaddr.sin_addr.s_addr = INADDR_ANY;
  servaddr.sin_port = htons(port);
  return servaddr;
}

int createSocket() {
  int sockfd;
  if ( (sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0 ) {
    perror("socket creation failed");
    exit(EXIT_FAILURE);
  }
  return sockfd;
}

void bindSocketWithServer(int sockfd, struct sockaddr_in servaddr) {
  if ( bind(sockfd, (const struct sockaddr *)&servaddr,
        sizeof(servaddr)) < 0 )
  {
    perror("bind failed");
    exit(EXIT_FAILURE);
  }
}

char* recieve(int listenSocket, const int max_length) {
  struct sockaddr_storage client_address;
  memset(&client_address, 0, sizeof(client_address));

  socklen_t client_len = sizeof(client_address);
  char read[max_length];
  int bytes_received = recvfrom(
      listenSocket, (char *)read, max_length, 0,
      (struct sockaddr*)&client_address,
      &client_len
      );
  if (bytes_received < 1) {
    fprintf(stderr, "connection closed. (%d)\n", errno);
  }
  read[bytes_received] = '\0';
  char* p = &read[0];
  return p;
}

class UdpRecieveSocket {
  private:
    struct sockaddr_in address;
    int socket;
    int port;

    // void charcpy (char** dest, const char* target) {
    //   *dest = new char[strlen(target) + 1];
    //   strcpy(*dest, target);
    // }

  public:
    UdpRecieveSocket (const int _port) {
      port = _port;
      address = constructAddress(port);
      socket = createSocket();
      bindSocketWithServer(socket, address);
      printf("udp://%s:%d opened\n", "0.0.0.0", port);
    }

    char* recieveData (int MAX_LENGTH) {
      char* data = recieve(socket, MAX_LENGTH);
      return data;
    }

    ~UdpRecieveSocket () {
      close(socket);
      printf("udp://%s:%d closed\n", "0.0.0.0", port);
    }
};

class UdpSendSocket {
  private:
    struct sockaddr_in address;
    int socket;

  public:
    UdpSendSocket (const char* hostname, const int port) {
      address = fetchAddress(getHostByName(hostname), port);
      socket = createSocket();
      printf("udp://%s:%d connected\n", hostname, port);
    }

    void sendData (char message[]) {
      send(address, socket, message);
    }
};
