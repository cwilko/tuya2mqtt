#! /bin/ash

[  -z "$LGTV2MQTT_ARGS" ] && LGTV2MQTT_ARGS=""

node index.js ${LGTV2MQTT_ARGS}