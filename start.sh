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
        nohup ng serve --proxy-config proxy.config.json &
        popd
    done
}

CMD=$1
echo "./start.sh $CMD"
if [ "$CMD" == "all" ]; then
    startNetwork
    startBackend
    startFrontend
elif [ "$CMD" ==  "network" ]; then
    startNetwork
elif [ "$CMD" == "backend" ]; then
    startBackend
elif [ "$CMD" == "frontend" ]; then
    startFrontend
else
    echo "args: all, network, backend or frontend"
fi