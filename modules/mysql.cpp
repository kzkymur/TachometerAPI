#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <mysql/mysql.h>

class MySQL {
  private:
    MYSQL *conn = NULL;
    MYSQL_RES* res;
    char sql_str[255];

  public:
    MySQL (const char* host, const char* user, const char* passwd, const char* dbname) {
      memset(&sql_str[0] , 0x00 , sizeof(sql_str));

      conn = mysql_init(NULL);
      if (!mysql_real_connect(conn, host, user, passwd, dbname, 0, NULL, 0)) {
        exit(-1);
      }
      printf("connected mysql server\n");
    }

    MYSQL_RES* runQuery (char* query) {
      snprintf(&sql_str[0], sizeof(sql_str)-1, "%s", query);
      if (mysql_query(conn ,&sql_str[0])) {
        mysql_close(conn);
        exit(-1);
      }

      res = mysql_use_result(conn);
      return res;
    }

    ~MySQL () {
      mysql_free_result(res);
      mysql_close(conn);
    }
};
