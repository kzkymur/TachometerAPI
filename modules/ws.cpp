#include <set>
#include <websocketpp/config/asio_no_tls.hpp>
// #include <websocketpp/config/asio.hpp>
#include <websocketpp/server.hpp>
#include <websocketpp/common/thread.hpp>

typedef websocketpp::server<websocketpp::config::asio> server;
// typedef websocketpp::lib::shared_ptr<websocketpp::lib::asio::ssl::context> context_ptr;

using websocketpp::connection_hdl;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;
using websocketpp::lib::thread;

class WsServer {
  private:
    typedef std::set<connection_hdl,std::owner_less<connection_hdl>> con_list;

    server m_server;
    con_list m_connections;
    thread runThread;

  public:
    WsServer(const int port) {
      m_server.init_asio();

      m_server.set_open_handler(bind(&WsServer::on_open,this,::_1));
      m_server.set_close_handler(bind(&WsServer::on_close,this,::_1));
      m_server.set_message_handler(bind(&WsServer::on_message,this,::_1,::_2));
      run(port);
    }

    ~WsServer() {
      runThread.join();
    }

    void on_open(connection_hdl hdl) {
      m_connections.insert(hdl);
    }

    void on_close(connection_hdl hdl) {
      m_connections.erase(hdl);
    }

    void on_message(connection_hdl hdl, server::message_ptr msg) {
      for (auto it : m_connections) {
        m_server.send(it,msg);
      }
    }

    void run(int port) {
      m_server.listen((uint16_t)port);
      m_server.start_accept();

      thread runThread(bind(&server::run,&m_server));
      runThread.detach();
      std::cout << "ws://0.0.0.0:" << port << " opend" << std::endl;
    }

    void broadcast(char* data) {
      std::string msg(data);
      // server::message_ptr msg;
      // std::string str_data(data);
      // std::cout << str_data << std::endl;
      // msg->set_opcode(websocketpp::frame::opcode::text);
      // std::cout << "message setted" << std::endl;
      // msg->set_payload(str_data);
      // std::cout << "message setted" << std::endl;
      for (auto it : m_connections) {
        m_server.send(it, msg, websocketpp::frame::opcode::text);
      }
    }
};
