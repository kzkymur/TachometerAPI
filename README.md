# TachometerAPI

## Server Build And Host
```bash
mysql
source ./source.sql;
exit;

cmake CMakeLists.txt
make
./udpToWsConverter

cd archive
npm i
npm run serve
```

## WebFront Serve
```bash
cd wsTachometer
npm i
npm run dev
```

## Daemonize
```
./daemonUdpToWsConverter
npm i -g forever
cd archive;
forever start -c "npm run serve" .
```

## DemoLink
http://localhost:8080/
