#!/usr/bin/env node

const log = require('yalm');
const Mqtt = require('mqtt');
const TuyAPI = require('tuyapi');
const config = require('./config.js');
const pkg = require('./package.json');
const fs = require('fs');
const yaml = require('js-yaml');

log.setLevel(config.verbosity);

try {
    let fileContents = fs.readFileSync(config.file, 'utf8');
    let deviceMappings = yaml.safeLoad(fileContents);
} catch (err) {
    log.debug(err)
    log.debug("Could not find mappings file:", config.file);
    let deviceMappings = []
}

let mqttConnected;
let lastError;

log.info(pkg.name + ' ' + pkg.version + ' starting');
log.info('mqtt trying to connect', config.url);

const mqtt = Mqtt.connect(config.url, {will: {topic: config.name + '/connected', payload: '0', retain: true}});

mqtt.on('connect', () => {
    mqttConnected = true;

    log.info('mqtt connected', config.url);

    log.info('mqtt subscribe', config.name + '/set/#');
    mqtt.subscribe(config.name + '/set/#');
});

mqtt.on('close', () => {
    if (mqttConnected) {
        mqttConnected = false;
        log.info('mqtt closed ' + config.url);
    }
});

mqtt.on('error', err => {
    log.error('mqtt', err);
});

mqtt.on('message', (topic, payload) => {
    payload = String(payload);
    try {
        payload = JSON.parse(payload);
    } catch (err) {
        console.log(err)
    }

    log.debug('mqtt <', topic, payload);

    const parts = topic.split('/');

    switch (parts[1]) {
        case 'set':
            switch (parts[3]) {
                case 'power':
                    if (deviceMappings.filter(e => e.name === parts[2]).length > 0)
                        setPowerState(parts[2], payload.value);
                    else
                        log.debug("Device mapping not found for device: ", parts[2])
                    break;
                case 'value':
                    break;
                default:
                    log.debug("Unknown MQTT command");
            }
            break;
        default:
    }
});

function setPowerState(deviceName, payload) {

    try {
        parms = getDeviceParms(deviceName)
        const device = new TuyAPI(parms);

        return (async () => {

            try {
                await device.find();

                await device.connect();

                let status = await device.get({dps: parms.dps});

                log.debug(`Current status: ${status}.`);

                log.debug(`Setting ${payload}`);

                await device.set({dps: parms.dps, set: payload});

                status = await device.get({dps: parms.dps});

                log.debug(`New status: ${status}.`);

                device.disconnect();
            } catch (err) {
                console.log(err)
            }
        })();
    } catch (err) {
        console.log(err);
    }

}

function getPowerState(deviceName) {

    parms = getDeviceParms(deviceName)
    const device = new TuyAPI(parms);

    return (async () => {
        try {
            await device.find();

            await device.connect();

            let status = await device.get({dps: parms.dps});

            console.log(`Current status: ${status}.`);

            device.disconnect();

            return status;
        } catch (err) {
            console.log(err)
        }
    })();

}


function getDeviceParms(deviceName) {
    return deviceMappings.find(o => o.name === deviceName);
}

