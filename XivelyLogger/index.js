/*** XivelyLogger Z-Way Home Automation module *************************************

 Version: 0.0.2

 -----------------------------------------------------------------------------
 Author: Rick van Haasen
 Description:
     Log sensor value to Xively web service
     Based on module "SensorValue logger" from Poltorak Serguei <ps@z-wave.me>

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function XivelyLogger (id, controller) {
    // Call superconstructor first (AutomationModule)
    XivelyLogger.super_.call(this, id, controller);
};

inherits(XivelyLogger, AutomationModule);

_module = XivelyLogger;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

XivelyLogger.prototype.init = function (config) {
    // Call superclass' init (this will process config argument and so on)

    console.log("RVH: loading XivelyLogger");
    XivelyLogger.super_.prototype.init.call(this, config);

    // Remember "this" for detached callbacks (such as event listener callbacks)
    var self = this;

    this.handler = function (vDev) {

	console.log("XivelyLogger module: new value:"+ vDev.get("metrics:level")); 

        var xively_url="https://api.xively.com/v2/feeds/${feed}";
        var fdat = '{ "version": "1.0.0", "datastreams": [ { "id": "${id}", "current_value": "${val}" } ] }';

	// Xively does not display symbolic values properly in graph...
	var level = vDev.get('metrics:level');
	if (level == "on")
		level=1;
	if (level == "off")
		level=0;

        http.request({
                method: 'PUT',
                data: fdat.replace("${val}",level).replace("${id}", self.config.name),
                headers: {
                        "X-ApiKey":self.config.API_key
                },
                url: xively_url.replace("${feed}", self.config.feed)
        });


        if (self.config.log2File) {
            var storedLog = loadObject("SensorValueLogging_" + vDev.id + "_" + self.id);
            if (!storedLog) {
                storedLog = {
                    deviceId: vDev.id,
                    deviceName: vDev.get("metrics:title"),
                    sensorData: []
                };
            }
            storedLog.sensorData.push({"time": Date.now(), "value": level});
            saveObject("SensorValueLogging_" + vDev.id + "_" + self.id, storedLog);
            storedLog = null;
        }


    };

    // Setup metric update event listener
    this.controller.devices.on(this.config.device, "change:metrics:level", this.handler);
};

XivelyLogger.prototype.stop = function () {
    XivelyLogger.super_.prototype.stop.call(this);

    this.controller.devices.off(this.config.device, "change:metrics:level", this.handler);
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

// This module doesn't have any additional methods
