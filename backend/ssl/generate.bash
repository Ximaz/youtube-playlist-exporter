#!/bin/bash -e

EMAIL="malo.durand@epitech.eu"
DAYS=$(( 365 * 1 ))
KEY_SIZE=4096

COUNTRY_NAME="FR"
STATE="Lille"
LOCALITY_NAME="Lille"
ORG="Youtube Playlist Downloader"
COMMON_NAME="localhost"


function generate_csr {
    local CONFIG="[req]
    distinguished_name=req_distinguished_name
    req_extensions=v3_req
    days=${DAYS}
    prompt=no

    [req_distinguished_name]
    C=${COUNTRY_NAME}
    ST=${STATE}
    L=${LOCALITY_NAME}
    O=${ORG}
    CN=${COMMON_NAME}
    emailAddress=${EMAIL}

    [v3_req]
    keyUsage=nonRepudiation, digitalSignature, keyEncipherment
    extendedKeyUsage=serverAuth
    subjectAltName=@alt_names

    [alt_names]
    DNS.1=localhost
    "

    openssl genrsa -out ${COMMON_NAME}.key "${KEY_SIZE}"
    openssl req -new -key ${COMMON_NAME}.key -out ${COMMON_NAME}.csr -config <( echo "${CONFIG}")
}

function generate_crt {
    openssl x509 -signkey ${COMMON_NAME}.key -in ${COMMON_NAME}.csr -req -out ${COMMON_NAME}.crt
}

generate_csr
generate_crt
