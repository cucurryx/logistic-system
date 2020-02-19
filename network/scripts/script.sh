#! /bin/bash

CHANNEL_NAME="milkchannel"


####################### functions ########################
createChannel() {
	CORE_PEER_LOCALMSPID=partya
	CORE_PEER_ADDRESS=milk-partya:7051
	CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/partya.example.com/users/Admin@partya.example.com/msp
	echo "===================== Creating channel ===================== "
	peer channel create -o milk-orderer:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx
	echo "===================== Channel created ===================== "
}

joinChannel() {
	for org in partya partyb partyc
	do
		CORE_PEER_LOCALMSPID=$org
		CORE_PEER_ADDRESS=milk-$org:7051
		CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$org.example.com/users/Admin@$org.example.com/msp
		echo "===================== Org $org joining channel ===================== "
		peer channel join -b $CHANNEL_NAME.block -o milk-orderer:7050
		echo "===================== Channel joined ===================== "
	done
}

getState() {
	CORE_PEER_LOCALMSPID=partya
	CORE_PEER_ADDRESS=milk-partya:7051
	CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/partya.example.com/users/User1@partya.example.com/msp
	echo "===================== Invoking chaincode ===================== "
	peer chaincode invoke -o milk-orderer:7050 -C $CHANNEL_NAME --waitForEvent -n $CC_NAME --peerAddresses milk-partya:7051 --peerAddresses milk-partyb:7051 -c '{"Args":["getCowHistory", "11111"]}'
	echo "===================== Chaincode invoked ===================== "
}

putState() {
	CORE_PEER_LOCALMSPID=partya
	CORE_PEER_ADDRESS=milk-partya:7051
	CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/partya.example.com/users/User1@partya.example.com/msp
	echo "===================== Invoking chaincode ===================== "
	peer chaincode invoke -o milk-orderer:7050 -C $CHANNEL_NAME --waitForEvent -n $CC_NAME --peerAddresses milk-partya:7051 --peerAddresses milk-partyb:7051 -c '{"Args":["putCowReport", "11111", "report data aaaa"]}'
	echo "===================== Chaincode invoked ===================== "
}

#  peer chaincode invoke -o milk-orderer:7050 -C milkchannel --waitForEvent -n factory --peerAddresses milk-partya:7051 milk-partyb:7051 -c '{"Args":["putMilkReport", "2222", "11111", "666",  "report data aaaa"]}'

####################### commands ########################

## create channel
echo
echo "create channel..."
createChannel

## join channel
echo
echo "join channel..."
joinChannel

## chaincode set up
echo
echo "chaincode set up..."
. scripts/install-chaincode.sh 
chaincodeSetUp

# ## put state in ledger
# echo
# echo "putting state..."
# putState

# ## get state in ledger
# echo
# echo "getState..."
# getState

## end
echo "create channel and install chaincode finished successfully!"