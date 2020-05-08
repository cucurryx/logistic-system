#! /bin/bash

stopNetwork() {
    pushd network
    ./network.sh down
    popd
}

stopBackend() {
    echo "killing...."
    ps -aux | grep "node /usr/local/bin/nest start"
    echo
    kill -9 `ps -aux | grep "node /usr/local/bin/nest start" | awk '{print $2}'`
}

stopFrontend() {
    echo "killing...."
    ps -aux | grep "ng serve --host"
    echo
    kill -9 `ps -aux | grep "ng serve --host" | awk '{print $2}'`
}

CMD=$1
echo "./stop.sh $CMD"
if [ "$CMD" == "all" ]; then
    stopNetwork
    stopBackend
    stopFrontend
elif [ "$CMD" ==  "network" ]; then
    stopNetwork
elif [ "$CMD" == "backend" ]; then
    stopBackend
elif [ "$CMD" == "frontend" ]; then
    stopFrontend
else
    echo "args: all, network, backend or frontend"
fi
