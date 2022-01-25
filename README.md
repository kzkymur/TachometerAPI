# TachometerAPI

## Server Build And Host
```bash
cmake CMakeLists.txt
make
./udpToWsConverter

cd Archive
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
forever start -c "npm run serve" ./Archive
```

## DemoLink
http://localhost:8080/
