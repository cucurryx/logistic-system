#! /bin/bash

buildFrontend() {
    echo 'building frontend...'

    for org in shipper transporter warehouse consignee; do
        echo "building [$org] frontend..." 
        pushd frontend/$org

        rm package-lock.json
        rm -rf node_modules/
        npm install
        ng build --prod

        popd
        echo "done..."
    done

    echo 'copy frontend resources to nginx...'
    for org in shipper transporter warehouse consignee; do
        echo "copy [$org] frontend..." 
        cp -r frontend/$org/dist/$org /usr/share/nginx/html/
        echo "done..."
    done

    echo
}

buildBackend() {
    echo 'building backend...'

    for org in shipper transporter warehouse consignee; do
        echo "building [$org] backend..." 
        pushd backend/$org

        rm package-lock.json
        rm -rf node_modules/
        npm install
        npm run build

        popd
        echo "done..."
    done
}

CMD=$1
echo "./build.sh $CMD"
if [ "$CMD" == "all" ]; then
    buildFrontend
    buildBackend
elif [ "$CMD" == "backend" ]; then
    buildBackend
elif [ "$CMD" == "frontend" ]; then
    buildFrontend
else
    echo "args: all, backend or frontend"
fi