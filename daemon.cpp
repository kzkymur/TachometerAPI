#include <iostream>
#include <sys/types.h>
#include <sys/stat.h>

#include <fcntl.h>
#include <signal.h>
#include <stdlib.h>
#include <sysexits.h>
#include <unistd.h>
#include <syslog.h>

#include <string>

#include "modules/toml11/toml.hpp"
#include "modules/udp.cpp"
#include "modules/ws.cpp"
#include "modules/daemon.cpp"

using namespace std;

#define MAXFD 64

int demonize(int chdir_flg){

  int i = 0;
  int fd = 0;
  pid_t pid = 0;


  //------------------------------------------------------
  // 状態.
  // プログラム起動時は親プロセス(shell)があり、TTYを持っている.
  //------------------------------------------------------


  //------------------------------------------------------
  // 子プロセスを作成して親を切り離しシェルに制御を戻す.
  //------------------------------------------------------
  if((pid = fork()) == -1){

    return -1;

    // 子プロセスを作成したら親プロセスは終了する.
  }else if(pid != 0){

    // ユーザー定義のクリーンアップ関数を呼ばないように_exit()を行う.
    _exit(0);
  }


  //------------------------------------------------------
  // 状態.
  // 子プロセスのみとなったがTTYは保持したまま.
  //------------------------------------------------------


  //------------------------------------------------------
  // TTYを切り離してセッションリーダー化、プロセスグループリーダー化する.
  //------------------------------------------------------
  setsid();


  //------------------------------------------------------
  // HUPシグナルを無視.
  // 親が死んだ時にHUPシグナルが子にも送られる可能性があるため.
  //------------------------------------------------------
  signal(SIGHUP, SIG_IGN);


  //------------------------------------------------------
  // 状態.
  // このままだとセッションリーダーなのでTTYをオープンするとそのTTYが関連づけられてしまう.
  //------------------------------------------------------


  //------------------------------------------------------
  // 親プロセス(セッショングループリーダー)を切り離す.
  // 親を持たず、TTYも持たず、セッションリーダーでもない状態になる.
  //------------------------------------------------------
  if((pid = fork()) == 0){
    // 子プロセス終了.
    _exit(0);
  }



  //------------------------------------------------------
  // デーモンとして動くための準備を行う.
  //------------------------------------------------------

  // カレントディレクトリ変更.
  if(chdir_flg == 0){

    // ルートディレクトリに移動.
    chdir("/");
  }



  // 親から引き継いだ全てのファイルディスクリプタのクローズ.
  for(i = 0; i < MAXFD; i++){
    close(i);
  }

  // stdin,stdout,stderrをdev/nullでオープン.
  // 単にディスクリプタを閉じるだけだとこれらの出力がエラーになるのでdev/nullにリダイレクトする.
  if((fd = open("/dev/null", O_RDWR, 0) != -1)){

    // ファイルディスクリプタの複製.
    // このプロセスの0,1,2をfdが指すdev/nullを指すようにする.
    dup2(fd, 0);
    dup2(fd, 1);
    dup2(fd, 2);
    if(fd < 2){
      close(fd);
    }
  }

  return (0);

}

int main(int argc, const char * argv[]) {

  char buf[256];
  demonize(1);

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
