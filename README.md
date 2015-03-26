# z-way-xively
Z-way module for sending sensor data to Xively

1) stop the server from console: sudo service z-way-server stop
2) Copy directory XivelyLogger to userModules ( /opt/z-way-server/automation/userModules)
3) start the server from console: sudo service z-way-server start

If you do not have an account already, create one at https://xively.com/
Create a feed where the sensordata can be send to.

Now the module can be configured http://find.zwave.me/z-way-ha/ (or directly on your local network http://192.168.X.X:8083)
(Note: In the configuration panel, the name of the feed can not have spaces. With spaces, Xively will not display the feed).
