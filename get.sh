#! /bin/bash

getNetwork() {
    echo "network docker containers..."

    echo
}

getBackend() {
    echo "backend processes...."
    ps -aux | grep "node /usr/local/bin/nest start"
    echo
}

getFrontend() {
    echo "frontend processes...."
    ps -aux | grep "ng serve --host" 
    echo
}

CMD=$1
echo "./stop.sh $CMD"
if [ "$CMD" == "all" ]; then
    getNetwork
    getBackend
    getFrontend
elif [ "$CMD" ==  "network" ]; then
    getNetwork
elif [ "$CMD" == "backend" ]; then
    getBackend
elif [ "$CMD" == "frontend" ]; then
    getFrontend
else
    echo "args: all, network, backend or frontend"
fi
