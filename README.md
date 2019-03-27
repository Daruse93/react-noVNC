# react-noVNC
React component for a noVNC connection

### Usage

Within a React component, you can render this like:

``` javascript
return (
  <NoVNC 
    connectionName={this.props.connectionName}
    actionsBar={(props) => <Actions onDisconnect={props.onDisconnect}/>}
    password={this.props.device.remote.password}
    onBeforeConnect={this.onBeforeConnect}
    viewOnly={this.state.viewOnly}
    onDisconnected={this.onDisconnected}
    isFullScreen={this.state.isFull}
    callKey={this.state.callKey}
)
```

Props are defined as follows:

* `connectionName`
  * The name of the VNC server to connect to in the form of $ADDRESS:$PORT.
* `onDisconnected`
  * A callback for when the VNC server is disconnected from.
* `isSecure`
  * If true, use the `wss` protocol for secure websockets. Otherwise (by default), use `ws`.
* `actionsBar`
  * Render prop to be displayed above the VNC container to perform actions such as disconnecting.
* `password`
  * Password to be sent when connecting to the VNC server.
* `passwordPrompt`
  * Render prop displayed if a password was not supplied but the VNC server requests a password.
* `onBeforeConnect`
  * A method, which started before connect to VNC
* `viewOnly`
  * view only mode, on or off (bool)
* `callKey`
  * send key for call in VNC (string), supported by: 'windows','ctrl','alt','tab','esc','ctrlaltdel'
* `isFullScreen`
  * is full screen ? (bool), add class 'fullscreen' on 'novnc' component (possible to use with [react-fullscreen component](https://github.com/snakesilk/react-fullscreen))
  
  
For a demo, see [https://github.com/larryprice/novnc-demos](https://github.com/larryprice/novnc-demos).
