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
# include_directories(/usr/local/opt/openssl@1.1/include)

# include_directories(/usr/local/include//)
include_directories(${CMAKE_INSTALL_PREFIX}/include)
# set(CMAKE_CXX_FLAGS "-lcrypto")

# a.outという実行ファイルをudpToWsConverter.cppから作成
add_executable(udpToWsConverter udpToWsConverter.cpp)
add_executable(serialToUdpConverter serialToUdpConverter.cpp)
add_executable(daemonUdpToWsConverter daemonUdpToWsConverter.cpp)
