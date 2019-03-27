import React from 'react'
import PropTypes from 'prop-types'
import RFB from 'novnc-core'
import KeyTable from "./input/keysym.js";

const createConnection = (connectionName, isSecure, onDisconnect, onConnect, onPasswordPrompt, password, viewOnly) => {
  let rfb = null;
  try {
    rfb = new RFB(document.getElementById('noVNC-canvas'), `ws${isSecure ? 's' : ''}://${connectionName}`,
      password && {credentials: {password}});
    rfb.addEventListener('connect', onConnect);
    rfb.addEventListener('disconnect', onDisconnect);
    rfb.addEventListener('credentialsrequired', onPasswordPrompt);
    rfb.scaleViewport = true;
    rfb.resizeSession = true;
    rfb.viewOnly = viewOnly;
  } catch (err) {
    console.error(`Unable to create RFB client: ${err}`)
    return onDisconnect({detail: {clean: false}})
  }

  return rfb
};

export default class VncContainer extends React.Component {
  static propTypes = {
    connectionName: PropTypes.string.isRequired,
    actionsBar: PropTypes.func,
    passwordPrompt: PropTypes.func,
    isSecure: PropTypes.bool,
    password: PropTypes.string,
    onBeforeConnect: PropTypes.func,
  };

  static defaultProps = {
    isSecure: false
  };

  state = {
    status: 'initializing',
    connectionName: this.props.connectionName,
    passwordRequired: false,
  };

  componentDidMount() {
    this.rfb = createConnection(this.props.connectionName, this.props.isSecure,
      this.onDisconnect, this.onStatusChange, this.onPasswordRequired, this.props.password, this.props.viewOnly)
  }

  sendCtrlAltDel() {
    this.rfb.sendKey(KeyTable.XK_Control_L, "ControlLeft", true);
    this.rfb.sendKey(KeyTable.XK_Alt_L, "AltLeft", true);
    this.rfb.sendKey(KeyTable.XK_Delete, "Delete", true);
    this.rfb.sendKey(KeyTable.XK_Delete, "Delete", false);
    this.rfb.sendKey(KeyTable.XK_Alt_L, "AltLeft", false);
    this.rfb.sendKey(KeyTable.XK_Control_L, "ControlLeft", false);
  }

  callKey = name => {

    let key = '';
    let code = '';

    switch (name) {
      case 'windows':
        key = KeyTable.XK_Super_L;
        code = 'MetaLeft';
        break;
      case 'ctrl':
        key = KeyTable.XK_Control_L;
        code = 'ControlLeft ';
        break;
      case 'alt':
        key = KeyTable.XK_Alt_L;
        code = 'AltLeft';
        break;
      case 'esc':
        key = KeyTable.XK_Escape;
        code = 'Escape';
        break;
      case 'tab':
        key = KeyTable.XK_Tab;
        break;
      case 'ctrlaltdel':
        key = 'ctrlaltdel';
        break;
      default:
        return true;
    }

    if(key !== ''){
      const btn = document.getElementById(`noVNC_toggle_${name}_button`);
      if (btn.classList.contains("noVNC_selected")) {
        if(key === 'ctrlaltdel'){
          this.sendCtrlAltDel();
        }else{
          this.rfb.sendKey(key,code, false);
        }
        btn.classList.remove("noVNC_selected");
      } else {
        if(key === 'ctrlaltdel'){
          this.sendCtrlAltDel();
        }else{
          this.rfb.sendKey(key,code,true);
        }
        btn.classList.add("noVNC_selected");
      }
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.viewOnly !== prevProps.viewOnly) {
      this.rfb.viewOnly = this.props.viewOnly;
    }
    if (this.props.callKey !== '') {
      this.callKey(this.props.callKey,);
    }
  }

  onStatusChange = () => {
    this.rfb.focus();
    this.setState(() => ({status: 'connected'}));
    this.props.onBeforeConnect();
  };

  onDisconnect = e => this.props.onDisconnected(!e.detail.clean || this.state.status !== 'connected')

  onUserDisconnect = () => this.rfb.disconnect();

  onPasswordRequired = () => this.setState(() => ({passwordRequired: true}))

  onSubmitPassword = password => {
    this.rfb.sendCredentials({password})
    this.setState(() => ({passwordRequired: false}))
  };

  render() {
    const classNoVnc = this.props.isFullScreen ? 'fullscreen' : '';
    return (
      <div>
        {this.props.actionsBar &&
        this.props.actionsBar({status: this.state.status, onDisconnect: this.onUserDisconnect})}
        {this.state.passwordRequired &&
        this.props.passwordPrompt({onSubmit: this.onSubmitPassword})}
        <div id='noVNC-canvas' className={classNoVnc} style={{display: this.state.passwordRequired ? 'none' : 'block'}}/>
      </div>
    )
  }
}
