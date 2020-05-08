#! /bin/bash

buildBackend() {
    for org in shipper transporter warehouse consignee; do
        echo "building backend... $org" 
        pushd backend/$org
        npm run build
        popd
        echo "done..."
    done
}

buildFrontend() {
    for org in shipper transporter warehouse consignee; do
        echo "starting frontend... $org"
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
        nohup ng serve --host 127.0.0.1  --proxy-config proxy.config.json --port $PORT &
        popd
        echo "done..."
    done
}

CMD=$1
echo "./build.sh $CMD"
if [ "$CMD" == "all" ]; then
    buildBackend
    buildFrontend
elif [ "$CMD" == "backend" ]; then
    buildBackend
elif [ "$CMD" == "frontend" ]; then
    buildFrontend
else
    echo "args: all, backend or frontend"
fi
