#! /bin/bash

packageChaincode() {
    CC_NAME=$1
    CC_SRC_PATH=$2
    setGlobals shipper
    echo "===================== Creating chaincode package ===================== "
    peer lifecycle chaincode package $CC_NAME.tar.gz --path ${CC_SRC_PATH} --lang golang --label ${CC_NAME}_1
    echo "===================== Chaincode packaged ===================== "
}

installChaincode() {
    CC_NAME=$1
    CC_SRC_PATH=$2
    for org in shipper transporter warehouse consignee; do
		setGlobals $org
        echo "===================== Org $org installing chaincode ===================== "
        peer lifecycle chaincode install $CC_NAME.tar.gz
        echo "===================== Org $org chaincode installed ===================== "
    done
}

getChaincodePackageID() {
    CC_NAME=$1
    CC_SRC_PATH=$2
    setGlobals shipper
    echo "===================== Query chaincode package ID ===================== "
    peer lifecycle chaincode queryinstalled >&log.txt
    export PACKAGE_ID=$(sed -n '/Package/{s/^Package ID: //; s/, Label:.*$//; p;}' log.txt | grep $CC_NAME)
    echo "packgeID=$PACKAGE_ID"
}

approveChaincode() {
    CC_NAME=$1
    CC_SRC_PATH=$2
    for org in shipper transporter warehouse consignee; do
		setGlobals $org
        echo "===================== Approving chaincode definition for $org ===================== "
        peer lifecycle chaincode approveformyorg --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --signature-policy "OR('ShipperMSP.peer','TransporterMSP.peer','WarehouseMSP.peer','ConsigneeMSP.peer')" --name $CC_NAME --version 1 --sequence 1 --package-id ${PACKAGE_ID} --waitForEvent
        echo "===================== Chaincode definition approved ===================== "
    done
}

checkCommitReadiness() {
    CC_NAME=$1
    CC_SRC_PATH=$2
    for org in shipper transporter warehouse consignee; do
		setGlobals $org
        checkCommitReadiness "\"shipper\": true" "\"transporter\": true" "\"warehouse\": true" "\"consignee\": true"
    done
}

peerParameters() {
    params=""
    for org in shipper transporter warehouse consignee; do
        ca=""
        port=7051
        if [ "$org" == "shipper" ]; then
            ca=$SHIPPER_CA
            port=7051
        elif [ "$org" == "transporter" ]; then
            ca=$TRANSPORTER_CA
            port=8051
        elif [ "$org" == "warehouse" ]; then
            ca=$WAREHOUSE_CA
            port=9051
        elif [ "$org" == "consignee" ]; then
            ca=$CONSIGNEE_CA
            port=10051
        fi
        peerAddr="peer0.$org.logistic.com:$port"
        params="$params --peerAddresses $peerAddr --tlsRootCertFiles $ca "
    done
    echo $params
}

commitChaincode() {
    CC_NAME=$1
    CC_SRC_PATH=$2
    setGlobals shipper
    params=$(peerParameters)
    echo "params: $params"
    echo "===================== Commiting chaincode definition to channel ===================== "
    peer lifecycle chaincode commit --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME $params --signature-policy "OR('ShipperMSP.peer','TransporterMSP.peer','WarehouseMSP.peer','ConsigneeMSP.peer')" --name $CC_NAME --version 1 --sequence 1  --waitForEvent
    echo "===================== Chaincode definition committed ===================== "
}

initChaincode() {
    CC_NAME=$1
    CC_SRC_PATH=$2
    setGlobals shipper
    params=$(peerParameters) #peerAddress parameters and their root ca cert
    echo "===================== Initializing chaincode ===================== "
    peer chaincode invoke --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n $CC_NAME $params -c "{\"Args\":[\"${CC_NAME}_contract:instantiate\"]}" --waitForEvent
    echo "===================== Chaincode initialized ===================== "
}

chaincodeSetUp() {
    CC_SRC_PATH=$GOPATH/src/chaincode/
    CC_NAME=logistic

    echo
    echo
    echo "chaincode $CC_NAME set up now ....."

    ## package chaincode
    echo
    echo "packaging chaincode..."
    packageChaincode $CC_NAME $CC_SRC_PATH

    ## install chaincode
    echo
    echo "installing chaincode"
    installChaincode $CC_NAME $CC_SRC_PATH

    ## query chaincode package ID
    echo
    echo "querying package id"
    getChaincodePackageID $CC_NAME $CC_SRC_PATH

    ## approve chaincode
    echo
    echo "approving chaincode"
    approveChaincode $CC_NAME $CC_SRC_PATH

    . scripts/check-commit-readiness.sh

    ## commit chaincode
    echo
    echo "committing chaincode"
    commitChaincode $CC_NAME $CC_SRC_PATH

    # TODO: maybe not need init
    ## init chaincode
    echo
    echo "initializing chaincode"
    initChaincode $CC_NAME $CC_SRC_PATH
}