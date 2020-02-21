#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $6)
    local CP=$(one_line_pem $7)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGMSP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${P1PORT}/$4/" \
        -e "s/\${CAPORT}/$5/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json 
}

ORG=shipper
ORGMSP=ShipperMSP
P0PORT=7051
P1PORT=7052
CAPORT=7054
PEERPEM=crypto-config/peerOrganizations/shipper.logistic.com/tlsca/tlsca.shipper.logistic.com-cert.pem
CAPEM=crypto-config/peerOrganizations/shipper.logistic.com/ca/ca.shipper.logistic.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-shipper.json