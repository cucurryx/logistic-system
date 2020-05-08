#! /bin/bash

startNetwork() {
    pushd network
    ./network.sh restart
    popd
}

startBackend() {
    echo 'starting backend...'
    docker-compose -f ./backend/docker-compose.yaml up -d
    echo 'done'
}

startFrontend() {
    echo 'starting frontend...'
    cp ./nginx/nginx.conf /usr/share/nginx
    echo 'stopping nginx'
    nginx -s stop
    echo 'restarting nginx'
    nginx -c /usr/share/nginx/nginx.conf
    echo 'done'
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
