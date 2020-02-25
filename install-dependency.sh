#! /bin/bash

for org in shipper transporter warehouse consignee; do
    pushd backend/$org
    npm i
    popd

    pushd frontend/$org
    npm i
    popd
done