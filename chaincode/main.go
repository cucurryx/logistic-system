package main

import (
	"fmt"
	logistic "logistic/contract"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func main() {

	contract := new(logistic.LogisticContract)
	contract.Name = "logistic_contract"
	contract.Info.Version = "0.0.1"

	chaincode, err := contractapi.NewChaincode(contract)

	if err != nil {
		panic(fmt.Sprintf("Error creating chaincode. %s", err.Error()))
	}

	chaincode.Info.Title = "LogisticChaincode"
	chaincode.Info.Version = "0.0.1"

	err = chaincode.Start()

	if err != nil {
		panic(fmt.Sprintf("Error starting chaincode. %s", err.Error()))
	}
}
