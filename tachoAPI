#include <stdio.h>
#include <unistd.h>

void mainLoop() {
    while(1) {
        // ループさせたい処理
        sleep(3); 
    }
}


int main(void) {
    //ここで子プロセスを生成し親は終了
    if(daemon(0, 0) == 0) {
        mainLoop();
    } else {
        printf("error\n");
    }
    return 0;
}
