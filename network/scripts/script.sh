#! /bin/bash

ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/logistic.com/orderers/orderer.logistic.com/msp/tlscacerts/tlsca.logistic.com-cert.pem
SHIPPER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/shipper.logistic.com/peers/peer0.shipper.logistic.com/tls/ca.crt
TRANSPORTER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/transporter.logistic.com/peers/peer0.transporter.logistic.com/tls/ca.crt
WAREHOUSE_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/warehouse.logistic.com/peers/peer0.warehouse.logistic.com/tls/ca.crt
CONSIGNEE_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/consignee.logistic.com/peers/peer0.consignee.logistic.com/tls/ca.crt
CHANNEL_NAME=logistic-channel

####################### functions ########################
createChannel() {
	setGlobals shipper
	echo "===================== fuck it Creating channel $CHANNEL_NAME ===================== "
	peer channel create -o orderer.logistic.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile $ORDERER_CA
	echo "===================== Channel created ===================== "
}

setGlobals() {
  	ORG=$1
	if [ "$ORG" == "shipper" ]; then
		PORT=7051
    	CORE_PEER_TLS_ROOTCERT_FILE=$SHIPPER_CA
		CORE_PEER_LOCALMSPID=ShipperMSP
	elif [ "$ORG" == "transporter" ]; then
		PORT=8051
    	CORE_PEER_TLS_ROOTCERT_FILE=$TRANSPORTER_CA
		CORE_PEER_LOCALMSPID=TransporterMSP
	elif [ "$ORG" == "warehouse" ]; then
		PORT=9051
    	CORE_PEER_TLS_ROOTCERT_FILE=$WAREHOUSE_CA
		CORE_PEER_LOCALMSPID=WarehouseMSP
	elif [ "$ORG"  == "consignee" ]; then
		PORT=10051
    	CORE_PEER_TLS_ROOTCERT_FILE=$CONSIGNEE_CA
		CORE_PEER_LOCALMSPID=ConsigneeMSP
	fi

	CORE_PEER_ADDRESS=peer0.$ORG.logistic.com:$PORT
	CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG.logistic.com/users/Admin@$ORG.logistic.com/msp
}

joinChannel() {
	for org in shipper transporter warehouse consignee
	do
		setGlobals $org
		echo "===================== Org $org joining channel ===================== "
		peer channel join -b $CHANNEL_NAME.block
		echo "===================== Channel joined ===================== "
	done
}

updateAnchorPeers() {
	for org in shipper transporter warehouse consignee
	do
		setGlobals $org
		echo "===================== Org $org updating anchor peer ===================== "
		peer channel update -o orderer.logistic.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls --cafile $ORDERER_CA
		echo "===================== Anchor peer updated ===================== "
	done
}

getState() {
	CC_NAME=logistic
	setGlobals shipper
	params=$(peerParameters)
	echo "===================== Invoking chaincode ===================== "
	peer chaincode invoke --tls --cafile $ORDERER_CA -C $CHANNEL_NAME --waitForEvent -n $CC_NAME $params -c '{"Args":["getState", "key key key"]}'
	echo "===================== Chaincode invoked ===================== "
}

putState() {
	CC_NAME=logistic
	setGlobals shipper
	params=$(peerParameters)
	echo "===================== Invoking chaincode ===================== "
	peer chaincode invoke --tls --cafile $ORDERER_CA -C $CHANNEL_NAME --waitForEvent -n $CC_NAME $params -c '{"Args":["putState", "key key key", "value value value"]}'
	echo "===================== Chaincode invoked ===================== "
}

####################### commands ########################

# FABRIC_CFG_PATH=$PWD/config/

## create channel
echo
echo "create channel..."
createChannel

## join channel
echo
echo "join channel..."
joinChannel

## update anchor peers
echo
echo "updating anchor peers"
updateAnchorPeers

## chaincode set up
echo
echo "chaincode set up..."
. scripts/install-chaincode.sh 
chaincodeSetUp

## put state in ledger
#echo
#echo "putting state..."
# putState

## get state in ledger
#echo
#echo "getState..."
#getState

## end
echo "create channel and install chaincode finished successfully!"
