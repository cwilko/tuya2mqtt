#! /bin/ash

[  -z "$TUYA2MQTT_ARGS" ] && TUYA2MQTT_ARGS=""

node index.js ${TUYA2MQTT_ARGS}