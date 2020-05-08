#! /bin/bash

startNetwork() {
    pushd network
    ./network.sh restart
    popd
}

startBackend() {
    for org in shipper transporter warehouse consignee; do
        echo "starting backend... $org" 
        pushd backend/$org
        rm -rf wallet/
        rm -rf nohup.out
        nohup node dist/main.js &
        popd
        echo "done..."
    done
}

startFrontend() {
    for org in shipper transporter warehouse consignee; do
        echo "starting frontend... $org"
        pushd frontend/$org
        rm -rf nohup.out
        PORT=4200
        if [ "$org" == "shipper" ]; then
            PORT=4200
        elif [ "$org" == "transporter" ]; then
            PORT=4300
        elif [ "$org" == "warehouse" ]; then
            PORT=4400
        else 
            PORT=4500
        fi
        nohup ng serve --host 127.0.0.1 --proxy-config proxy.config.json --port $PORT &
        popd
        echo "done..."
    done
}

enrollAdmin() {
    for org in shipper transporter warehouse consignee; do
        pushd backend/$org
            npm run enroll
        popd
    done
}

CMD=$1
echo "./start.sh $CMD"
if [ "$CMD" == "all" ]; then
    startNetwork
    enrollAdmin
    startBackend
    startFrontend
elif [ "$CMD" ==  "network" ]; then
    startNetwork
elif [ "$CMD" == "backend" ]; then
    startBackend
elif [ "$CMD" == "frontend" ]; then
    startFrontend
elif [ "$CMD" == "enroll" ]; then
    enrollAdmin
else
    echo "args: all, network, backend or frontend"
fi
