import React, { Component } from 'react';
import './style/App.scss';
//import ChatContainer from './components/ChatContainer'; // now loaded async
import FetchManager from './libs/FetchManager'
import Login from './components/Login'
import PermissionManager from './PermissionManager.js'
import CacheManager from './CacheManager.js'
import Helper from './Helper.js'
import { connect } from "react-redux";
import { changeToast, changeView, changeUser, changeConnection } from "./actions/index";
//import Toast from "./components/Toast";
import Spinner from "./components/Spinner";
import MsgBuilder from "./libs/MsgBuilder";
import Popup from "./components/Popup";
import SVGIcons from "./SVGIcons";

class App extends Component {
  constructor(){
    super()
    let userNameFromUrl = new URLSearchParams(window.location.search).get('username') || '';
    window.app = {
      msgBuilder: new MsgBuilder(),
      fetchManager:new FetchManager(),
      permissionManager: new PermissionManager(),
      cacheManager: new CacheManager()
    };
    window.helper = new Helper();
    this.trackVisibility();
    //console.log('userNameFromUrl',userNameFromUrl);
    this.state = {
      userNameSelection: userNameFromUrl,
      username: userNameFromUrl,
      savedRoom: 'test',
      room: 'test',
      appReady:false,
      activateFirstChat:true,
      id:null
    };

    this.ref = {
      chatContainer:React.createRef()
    };

    window.initMap = this.onMapsReady.bind(this);
    window.onReceivedSharedFiles = this.onReceivedSharedFiles.bind(this);
    window.onReceivedPushMsg = this.onReceivedPushMsg.bind(this);

    this.loadChatContainer = this.loadChatContainer.bind(this);
    window.app.fetchManager.get('api/auth',{data:{token:localStorage.getItem('token')}}).then( ([err,data]) => {
      console.log('api/auth',data);
      this.onAuth({err:data.err,user:data.user,appInfos:data.appInfos})
    });
  }

  componentDidMount()
  {
    window.app.cacheManager.init().then( () =>
    {
      console.log('Cache Ready');
      if (!navigator.onLine) this.onOffline();
      window.addEventListener('online',this.onConnectionStateChange.bind(this));
      window.addEventListener('offline',this.onConnectionStateChange.bind(this));
      window.addEventListener('ServiceWorkerRegistered',this.onServiceWorkerRegistered.bind(this));
      window.addEventListener('beforeinstallprompt', (e) => {
        //console.log('beforeinstallprompt');
        e.preventDefault();   // Prevent Chrome 67 and earlier from automatically showing the prompt
        window.app.deferredInstallPrompt = e;  // Stash the event so it can be triggered later.
      });

    });
    // TO-DO indexed DB not supported warning


    /*window.app.fetchManager.get('api/chats/test',{data:{}}).then(([err,data]) =>
    {
      if (err) console.log(err);
      console.log(data);
    });*/
  }

  loadChatContainer() {
    //import("./components/Text").then(Text => this.setState({Text: Text.default}));
    import(/* webpackChunkName: "[ChatContainer]"*/ "./components/ChatContainer").then(AsyncChatContainer => this.setState({AsyncChatContainer: AsyncChatContainer.default}));
  }

  onMapsReady ()
  {
    //console.log('On Maps Ready');
    window.dispatchEvent(new CustomEvent('GoogleMapsReady'));
  }

  onOffline ()
  {
    this.props.changeConnection(navigator.onLine);
    console.log('on Offline');
    window.app.cacheManager.get('cache|auth').then( ([err,cacheResAuth]) =>
    {
      if (cacheResAuth)
      {
        console.log('ON OFFLINE!');
        this.onAuth({err:null,user:cacheResAuth.result.data[1],appInfos:cacheResAuth.result.data[2]})
      }
      else
      {
        console.log('No Cache Entries for auth found')
      }
    })
  }

  onReceivedPushMsg (msg)
  {
    console.log('onReceivedPushMsg',msg);
    //this.onNewMsg(msg);
  }

  onConnectionStateChange (e)
  {
    console.log('onConnectionStateChange',navigator.onLine,'socketManager',window.app.socketManager.socket.connected);
    this.props.changeConnection(navigator.onLine);
    window.app.socketManager.setShouldServeFromCache(!navigator.onLine);
    if (navigator.onLine && window.app.socketManager.socket.connected)
    {
       this.sendQueuedMsgs();
    }
  }

  sendQueuedMsgs ()
  {
    /*if (window.app.socketManager.emitChain.length)
    {
      console.log('Send queued emits',window.app.socketManager.emitChain);
      for (let s=0;s<window.app.socketManager.emitChain.length;s++)
      {
        let item = window.app.socketManager.emitChain[s];
        window.app.socketManager.emit.apply(window.app.socketManager,item.args);
      }
      window.app.socketManager.emitChain = [];
    }*/
  }

  onReceivedSharedFiles (sharedFiles)
  {
    if (sharedFiles && sharedFiles.length) console.log('onReceivedSharedFiles',sharedFiles);
    window.app.sharedFiles = sharedFiles;
  }

  onServiceWorkerRegistered ()
  {
    //console.log('onServiceWorkerRegistered');
    //window.dispatchEvent(new CustomEvent('ServiceWorkerRegistered'));
  }

  onAuth({err,user,appInfos})
  {
    //window.app.cacheManager.set('auth',{data:user,route:'auth'}).then(function (){});
    window.app.cacheManager.set('cache|appInfos',{data:appInfos,route:'appInfos'}).then(function (){});
    console.log('auth',err,user,'appInfos',appInfos);
    if (appInfos)
    {
      window.VERSION_APP = appInfos.version;
    }
    if (user)
    {
      this.loadChatContainer();
      if (user.darkModeActive && !document.documentElement.classList.contains('dark')) document.documentElement.classList.add('dark');
      if (user.reducedMotionActive && !document.documentElement.classList.contains('reducedMotion')) document.documentElement.classList.add('reducedMotion');

      for (let s=0;s<user.chats.length;s++)
      {
        let chat = user.chats[s];
        if (chat.latestMsg)
        {
          chat.latestMsg.createdAt = new Date(chat.latestMsg.createdAt);
        }
        if (this.state.activateFirstChat && s === 0 && !window.helper.isMobileView())
        {
          chat.active = true;
        }
        if (chat.user.lastOnlineAt)
        {
          chat.user.lastOnlineAt = new Date(chat.user.lastOnlineAt);
        }
        for (let m=0;m<chat.msgs.length;m++)
        {
          let msg = chat.msgs[m];
          msg.createdAt = new Date(msg.createdAt);
        }
      }
      user.chats = user.chats.sort((a,b) => {

        let latestMsgCreatedAtA = a.latestMsg ? a.latestMsg.createdAt : null;
        let latestMsgCreatedAtB = b.latestMsg ? b.latestMsg.createdAt : null;
        return latestMsgCreatedAtB - latestMsgCreatedAtA; // DESC
    })
    }
    this.props.changeUser(user || null);
    this.setState({appReady:true},function ()
    {

    });

    let isMockup = false;
    if ('URLSearchParams' in window)
    {
      isMockup = new URLSearchParams(new URL(window.location.href).search).has('mockup');
    }
    if (isMockup && !document.documentElement.classList.contains('mockup'))
    {
      document.documentElement.classList.add('mockup');
      window.app.isMockup = true
    }
  }

  trackVisibility ()
  {
    //console.log('trackVisibility')
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    document.addEventListener(visibilityChange, this.onVisibilityChange.bind(this), false);
    window.addEventListener('focus', this.onFocusChange.bind(this),true);
  }

  userStatusChanged (status,reason)
  {
    if (window.app.socketManager)
    {
      window.app.socketManager.emit("put:statusChanged", {
        userId:this.props.user.id,
        isOnline:status,
        reason:reason
      });
    }
  }

  onFocusChange ()
  {
    //console.log('onFocusChange',document.hasFocus());
    if (document.hasFocus()) window.dispatchEvent(new CustomEvent('WINDOW_FOCUS'));
  }

  onVisibilityChange ()
  {
    //console.log('onVisibilityChange',document.hidden);
    if (document.hidden)
    {
      this.userStatusChanged(false,'DOC_HIDDEN')
    }
    else
    {
      this.userStatusChanged(true,'DOC_SHOWN');
      window.dispatchEvent(new CustomEvent('DOC_SHOWN'));
    }
  }

  //put desktop in fullscreenmode
  toggleFullScreen () {
    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }

  renderLoader () {
    //return <div><h2>Loading...</h2></div>
    return <div className="startupPage">

    <Spinner></Spinner>

      <div className="progressContainer">
        <progress dir="ltr" id="progressbar" value="0" max="4607208.75"></progress>
      </div>

    </div>
  }

  onAuthSuccess (user,appInfos)
  {
    console.log('onAuthSuccess',user);
    this.onAuth({err:null,user:user,appInfos:appInfos});
  }

  removeFilePreview ()
  {
    this.setState({sharedFiles:false})
  }

  renderApp()
  {
    let { user } = this.props;
    let { AsyncChatContainer } = this.state;
    let props = {
      ref:(el => this.ref.chatContainer = el),
      sharedFiles:this.state.sharedFiles,
      removeFilePreview:this.removeFilePreview.bind(this),
      sendQueuedMsgs:this.sendQueuedMsgs.bind(this),
      //wrappedComponentRef:(el => this.ref.chatContainer = el)
    };
    return user && AsyncChatContainer ? <AsyncChatContainer {...props} /> : <Login onAuthSuccess={this.onAuthSuccess.bind(this)}></Login>
  }

  render()
  {
    let {view, user} = this.props;
    let {appReady, Text} = this.state;
    let props = {};
    return (
      <div {...props} data-view={view.view} className={'app font-fix os-mac'}>
        <div className="toastContainer">
          {this.props.toast}
        </div>
        {this.props.overlay}
        {appReady ? this.renderApp() : this.renderLoader()}
      </div>
    );
   /*return  <div>
     <button onClick={this.loadChatContainer}>Load component</button>
     {Text ? <Text/> : null}
   </div>*/
  }
}

/*const mapStateToProps = state => ({
  ...state
});*/

let mapStateToProps = function (state)
{
  return state;
}

let mapDispatchToProps = function (dispatch) {
//const mapDispatchToProps = dispatch => ({
  //setUser: (payload) => dispatch(setUser(payload))
  return {
    changeToast: function (data)
    {
      return dispatch(changeToast(data));
    },
    changeUser: function (data)
    {
      return dispatch(changeUser(data));
    },
    changeView: function (view)
    {
      return dispatch(changeView(view));
    },
    changeConnection: function (data)
    {
      return dispatch(changeConnection(data));
    }
  }
};

//export default withRouter(App);
export default connect(mapStateToProps, mapDispatchToProps)(App);