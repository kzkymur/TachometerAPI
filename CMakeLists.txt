# CMakeのバージョンを設定
cmake_minimum_required(VERSION 2.8)

# プロジェクト名と使用する言語を設定
project(web_tachometer_demo CXX)
# set(CMAKE_CXX_FLAGS "-std=c++11")
set(CMAKE_CXX_STANDARD 17)

include(ExternalProject)
ExternalProject_Add(
  ### Target name
  websocketpp
  ### Path to Git repository
  GIT_REPOSITORY https://github.com/zaphoyd/websocketpp
  CMAKE_ARGS     -DCMAKE_INSTALL_PREFIX=${CMAKE_INSTALL_PREFIX}
)
ExternalProject_Add(
  toml11
  GIT_REPOSITORY https://github.com/ToruNiina/toml11
  CMAKE_ARGS     -DCMAKE_INSTALL_PREFIX=${CMAKE_INSTALL_PREFIX}
)

set(THREADS_PREFER_PTHREAD_FLAG ON)
find_package(Threads REQUIRED)

include_directories(${CMAKE_INSTALL_PREFIX}/include)

# include_directories(/usr/local/opt/openssl@1.1/include)
# target_link_libraries(web_tachometer_demo -L/usr/local/Cellar/mysql/8.0.27_1/lib)
# set(CMAKE_CXX_FLAGS "-lcrypto")

# set(CMAKE_CXX_FLAGS "-L/usr/local/Cellar/mysql/8.0.27_1/lib -lmysqlclient -lboost_system")
set(CMAKE_CXX_FLAGS "-L/usr/local/Cellar/mysql/8.0.27_1/lib -lmysqlclient")

# a.outという実行ファイルをudpToWsConverter.cppから作成
add_executable(serialToUdpConverter serialToUdpConverter.cpp)
add_executable(udpToWsConverter udpToWsConverter.cpp)
add_executable(daemonUdpToWsConverter daemonUdpToWsConverter.cpp)

target_link_libraries(udpToWsConverter "-pthread")
target_link_libraries(daemonUdpToWsConverter "-pthread")
