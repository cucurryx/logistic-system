#! /bin/bash

# global variables
IMAGE_TAG="2.0"
CHANNEL_NAME="logistic-channel"
COMPOSE_FILE=docker-compose.yaml

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

    for orgmsp in shipper transporter warehouse consignee ; do
        configtxgen -profile LogisticChannel -outputAnchorPeersUpdate ./channel-artifacts/${orgmsp}anchors.tx -channelID $CHANNEL_NAME -asOrg ${orgmsp}
    done
}

generateFiles() {
    generateCerts
    generateChannelArtifacts
}

networkUp() {
    generateFiles

    IMAGE_TAG=$IMAGE_TAG docker-compose -f $COMPOSE_FILE up -d orderer partya partyb partyc cli ca-partya ca-partyb ca-partyc

    docker exec cli sh scripts/script.sh
}

networkDown() {
    docker-compose -f $COMPOSE_FILE down --volumes --remove-orphans
 
    # docker run -v $PWD:/tmp/first-network --rm hyperledger/fabric-tools:$IMAGETAG rm -Rf /tmp/first-network/ledgers-backup
    
    # CONTAINER_IDS=$(docker ps -aq)
    
    #TODO clean images
    rm -rf channel-artifacts/*.block channel-artifacts/*.tx crypto-config
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
else
    echo "up or down, make a choice"
fi