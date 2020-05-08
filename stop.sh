#! /bin/bash

stopNetwork() {
    pushd network
    ./network.sh down
    popd
}

stopBackend() {
    echo "killing...."
    pids=$(docker ps -a  | grep "node.12.16.3")
    docker-compose -f ./backend/docker-compose.yaml down --volumes --remove-orphans
    echo 'done'
}

stopFrontend() {
    echo "killing...."
    nginx -s stop
    echo 'done'
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
