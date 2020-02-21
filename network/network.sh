#! /bin/bash

# global variables
IMAGE_TAG="2.0"
CHANNEL_NAME="logistic-channel"
COMPOSE_FILE=docker-compose.yaml
CA_COMPOSE_FILE=docker-compose-ca.yaml

export PATH=${PWD}/../../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export VERBOSE=false

# functions
generateCerts() {
    if [ -d "crypto-config" ]; then
        rm -rf crypto-config/
    fi
    cryptogen generate --config=./crypto-config.yaml
    res=$?
    if [ $res -ne 0 ]; then
        echo "Failed to genearate certifacts..."
        exit 1
    fi
    echo
}

generateChannelArtifacts() {
    if ! [ -d channel-artifacts ]; then
        mkdir channel-artifacts
    fi
    configtxgen -profile LogisticGenesis -outputBlock ./channel-artifacts/genesis.block -channelID system-channel
    res=$?
    if [ $res -ne 0 ]; then
        echo "Failed to generate orderer genesis block..."
        exit 1
    fi
    echo

    configtxgen -profile LogisticChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
    res=$?
    if [ $res -ne 0 ]; then
        echo "Failed to generate channel configuration transaction..."
        exit 1
    fi
    echo

    for orgmsp in Shipper Transporter Warehouse Consignee; do
        configtxgen -profile LogisticChannel -outputAnchorPeersUpdate ./channel-artifacts/${orgmsp}anchors.tx -channelID $CHANNEL_NAME -asOrg ${orgmsp}
    done
}

generateFiles() {
    generateCerts
    generateChannelArtifacts
}

networkUp() {
    generateFiles

    export SHIPPER_CA_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/shipper.logistic.com/ca && ls *_sk)
    export TRANSPORTER_CA_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/transporter.logistic.com/ca && ls *_sk)
    export WAREHOUSE_CA_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/warehouse.logistic.com/ca && ls *_sk)
    export CONSIGNEE_CA_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/consignee.logistic.com/ca && ls *_sk)

    IMAGE_TAG=$IMAGE_TAG docker-compose -f $COMPOSE_FILE up -d orderer.logistic.com peer0.shipper.logistic.com peer0.transporter.logistic.com peer0.warehouse.logistic.com peer0.consignee.logistic.com cli
    IMAGE_TAG=$IMAGE_TAG docker-compose -f $CA_COMPOSE_FILE up -d ca-shipper ca-transporter ca-warehouse ca-consignee

    CHANNEL_NAME=$CHANNEL_NAME docker exec cli sh scripts/script.sh
}

clearContainers() {
    CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /dev-peer.*/) {print $1}')
    if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" == " " ]; then
        echo "---- No containers available for deletion ----"
    else
        docker rm -f $CONTAINER_IDS
    fi
}

removeUnwantedImages() {
  DOCKER_IMAGE_IDS=$(docker images | awk '($1 ~ /dev-peer.*/) {print $3}')
  if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" == " " ]; then
    echo "---- No images available for deletion ----"
  else
    docker rmi -f $DOCKER_IMAGE_IDS
  fi
}

networkDown() {
    docker-compose -f $COMPOSE_FILE down --volumes --remove-orphans
    docker-compose -f $CA_COMPOSE_FILE down --volumes --remove-orphans

    docker run -v $PWD:/tmp/first-network --rm hyperledger/fabric-tools:$IMAGETAG rm -Rf /tmp/first-network/ledgers-backup

    clearContainers
    removeUnwantedImages
    
    #TODO clean images
    rm -rf channel-artifacts/*.block channel-artifacts/*.tx crypto-config
}

restartCA() {
    docker-compose -f $CA_COMPOSE_FILE down --volumes --remove-orphans
    docker-compose -f $CA_COMPOSE_FILE up -d ca-shipper ca-transporter ca-warehouse ca-consignee
}

clean() {
    if [ -d channel-artifacts ]; then
        rm -rf channel-artifacts
    fi

    if [ -d crypto-config ]; then
        rm -rf crypto-config
    fi
}

MODE=$1
if [ "$MODE" == "up" ]; then
    networkUp
elif [ "$MODE" == "down" ]; then
    networkDown
elif [ "$MODE" == "generate" ]; then
    generateFiles
elif [ "$MODE" == "clean" ]; then
    clean
elif [ "$MODE" == "restart" ]; then
    networkDown && networkUp
elif [ "$MODE" == "ca" ]; then
    restartCA
else
    echo "up / down / generate / clean"
fi
