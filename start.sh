#! /bin/bash

startNetwork() {
    pushd network
    nohup ./network.sh restart &
    popd
}

startBackend() {
    for org in shipper transporter warehouse consignee; do
        pushd backend/$org
        nohup nest start &
        popd
    done
}

startFrontend() {
    for org in shipper transporter warehouse consignee; do
        pushd frontend/$org
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
        nohup ng serve --proxy-config proxy.config.json --port $PORT &
        popd
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