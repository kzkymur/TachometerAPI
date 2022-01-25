import http, { IncomingMessage, ServerResponse, } from 'http';
import { createConnection, Connection } from 'mysql2';
import fs from 'fs';
import { promisify } from 'util';
import toml from 'toml';

const readFileAsync = promisify(fs.readFile);

type Env = {
  MYSQL_HOST: string;
  MYSQL_USER: string;
  MYSQL_PASSWD: string;
  MYSQL_DBNAME: string;
  MYSQL_ENV: string;
  MYSQL_SOCK_ADDRESS: string;
  ARCHIVE_PORT: number;
};

type Responses = {
  archive: (connection: Connection, start: number, end: number) => Promise<ResponseInfo>;
  pathError: () => ResponseInfo;
  valueError: () => ResponseInfo;
};

type ResponseInfo = {
  statusCode: number;
  contentType: string;
  data: string;
};

const Response: Responses = {
  async archive (connection: Connection, start: number, end: number) {
    const runQuery = promisify(connection.query.bind(connection));
    const result = await runQuery(`SELECT UNIX_TIMESTAMP(time) as time, rpm FROM tachometer WHERE time BETWEEN FROM_UNIXTIME(${start}) AND FROM_UNIXTIME(${end});`);
    return {
      statusCode: 200,
      contentType: 'application/json',
      data: JSON.stringify(result),
    };
  },
  pathError () {
    return {
      statusCode: 404,
      contentType: 'application/json',
      data: JSON.stringify({ message: "Not Found" }),
    };
  },
  valueError () {
    return {
      statusCode: 412,
      contentType: 'application/json',
      data: JSON.stringify({ message: "start epoch time < end epoch time, please." }),
    };
  },
};

const main = async () => {
  const tomlObj = await readFileAsync("../.env.toml", 'utf-8');
  const env: Env = toml.parse(tomlObj.toString());
  const server = http.createServer();

  const onRequest = async (req: IncomingMessage, res: ServerResponse) => {
    const path = req.url;
    let statusCode: number, contentType: string, data: string;
    if (/\/[0-9]{10}\/[0-9]{10}(\/|)$/.test(path)) {
      const [_, start, end] = path.split('/').map(str => Number(str));
      if (start < end) {
        const connection = createConnection({
          host: env.MYSQL_ENV === "local" ? undefined : env.MYSQL_HOST,
          socketPath: env.MYSQL_ENV === "local" ? env.MYSQL_SOCK_ADDRESS : undefined,
          user: env.MYSQL_USER,
          password: env.MYSQL_PASSWD,
          database: env.MYSQL_DBNAME,
        });
        const response = await Response.archive(connection, start, end); 
        connection.end();
        statusCode = response.statusCode, contentType = response.contentType, data = response.data;
      } else {
        const response = Response.valueError();
        statusCode = response.statusCode, contentType = response.contentType, data = response.data;
      }
    } else {
      const response = Response.pathError(); 
      statusCode = response.statusCode, contentType = response.contentType, data = response.data;
    }
    res.writeHead(statusCode, { "content-type": contentType, });
    res.end(data);
  };

  const port = env.ARCHIVE_PORT;
  server.on('request', onRequest);
  server.listen(port)
  console.log(`Server running at http://localhost:${port}`);
}

main();
