import React, { Component } from 'react';
import './style/App.scss';
//import ChatContainer from './components/ChatContainer'; // now loaded async
import Login from './components/Login'
import PermissionManager from './PermissionManager.js'
import CacheManager from './CacheManager.js'
import Helper from './Helper.js'
import { connect } from "react-redux";
import { changeToast, changeView, changeUser, changeModal, changeConnection } from "./actions/index";
import Spinner from "./components/Spinner";
import Progress from "./components/Progress";
import MsgBuilder from "./libs/MsgBuilder";
import Toast from "./components/Toast";
import Modal from "./components/modals/Modal";

class App extends Component {
  constructor(){
    super()
    let userNameFromUrl = new URLSearchParams(window.location.search).get('username') || '';
    window.VERSION_APP = process.env.VERSION;
    window.app.msgBuilder = new MsgBuilder();
    window.app.permissionManager = new PermissionManager();
    window.app.cacheManager = new CacheManager();
    window.helper = new Helper();
    window.helper.trackVisibility(this.onFocusChange.bind(this),this.onVisibilityChange.bind(this),this.onPageShow.bind(this));
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

    if (localStorage.getItem('updateConfirmed'))
    {
       this.state.updateActive = true;
    }

    this.ref = {
      chatContainer:React.createRef()
    };

    window.initMap = this.onMapsReady.bind(this);
    window.onReceivedSharedFiles = this.onReceivedSharedFiles.bind(this);
    window.onReceivedPushMsg = this.onReceivedPushMsg.bind(this);

    this.loadChatContainer = this.loadChatContainer.bind(this);
    this.loadKPIDashboard = this.loadKPIDashboard.bind(this);
    if (navigator.onLine)
    {
      window.app.fetchManager.get('api/auth',{data:{token:localStorage.getItem('token')}}).then( ([err,data]) =>
      {
        //console.log('api/auth',data);
        if (data)
        {
          this.onAuth({err:data.err,user:data.user,appInfos:data.appInfos})
        }
      });
    }

    if (process.env.ENV !== 'PRODUCTION')
    {
       window.helper.updateManifest( (manifest) => {
         let envShort = process.env.ENV.substr(0,1);
         manifest.name = "Pairly PWA "+envShort;
         manifest.short_name = "Pairly PWA "+envShort;
         return manifest
       }).then(() => { });
    }
    window.helper.preventPinchToZoom()
    window.helper.preventDoubleTapToZoom()
  }

  componentDidMount()
  {
    window.app.cacheManager.init().then( () =>
    {
      //console.log('Cache Ready',navigator.onLine);
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
    window.addEventListener('RECEIVED_SERVICE_WORKER_VERSION',this.onReceivedServiceWorkerVersion.bind(this));
    window.addEventListener('UPDATE_DONE',this.onUpdateDone.bind(this));
    /*document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    }); // Prevent Body Bounce Scroll iOS 14 in standalone mode*/

    //this.props.changeModal({type:'UPDATE'})
  }

  loadChatContainer() {
    import(/* webpackChunkName: "[ChatContainer]"*/ "./components/ChatContainer").then(AsyncChatContainer => this.setState({AsyncChatContainer: AsyncChatContainer.default}));
  }

  loadKPIDashboard() {
    import(/* webpackChunkName: "[ChatContainer]"*/ "./components/KPIDashboard").then(AsyncKPIDashboard => this.setState({AsyncKPIDashboard: AsyncKPIDashboard.default}));
  }

  onReceivedServiceWorkerVersion ()
  {
    //console.log('RECEIVED_SERVICE_WORKER_VERSION',window.VERSION_SERVICE_WORKER);
    this.checkForUpdate()
  }

  onUpdateDone ()
  {
    console.info('onUpdateDone');
    this.setState({updateActive:false});
    window.location.reload();
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
        //console.log('ON OFFLINE!',cacheResAuth);
        this.onAuth({err:null,user:cacheResAuth.result.data[1],appInfos:cacheResAuth.result.data[2]})
      }
      else
      {
        console.log('No Cache Entries for auth found',err)
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
    window.app.cacheManager.set('cache|auth',{data:[err,user,appInfos],route:'auth'}).then(function (){});
    window.app.cacheManager.set('cache|appInfos',{data:appInfos,route:'appInfos'}).then(function (){});
    console.log('auth',err,user,'appInfos',appInfos);
    if (appInfos)
    {
      window.VERSION_APP_SERVER = appInfos.version;
      window.VERSION_SW_SERVER = appInfos.swVersion;
      this.onGetAppInfos(appInfos);
    }
    if (user)
    {
      //console.log('Load Chat Container');
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
    else
    {
      console.log('No user');
    }
    this.props.changeUser(user || null);
    this.setState({appReady:true},function ()
    {

    });

    let isMockup = false;
    let isKPIDashboard = false;
    let launchTime = 0;
    if ('URLSearchParams' in window)
    {
      let params = new URLSearchParams(document.location.search.substring(1));
      isMockup = params.has('mockup');
      isKPIDashboard = params.has('isKPIDashboard');
      launchTime = params.has('launchTime');
      if (launchTime)
      {
        window.app.launchTime = parseInt(params.get('launchTime'))
      }
    }
    if (isMockup && !document.documentElement.classList.contains('mockup'))
    {
      document.documentElement.classList.add('mockup');
      window.app.isMockup = true
    }
    if (localStorage.getItem('isBatteryTest'))
    {
      this.setBatteryTest(true);
    }
    if (isKPIDashboard)
    {
      this.loadKPIDashboard();
      window.app.isKPIDashboard = true
    }
    window.app.setBatteryTest = this.setBatteryTest.bind(this);
  }

  setBatteryTest (state)
  {
    console.info('setBatteryTest',state);
    //document.body.style.background = state ? 'red' : 'none';
    this.props.changeToast(<Toast text={'Battery test '+(state ? 'enabled' : 'disabled')}></Toast>);
    state ? localStorage.setItem('isBatteryTest','1') : localStorage.removeItem('isBatteryTest');
    window.app.isBatteryTest = state

  }

  userStatusChanged (status,reason)
  {
    console.info('userStatusChanged',status,'reason',reason)
    if (window.app.socketManager)
    {
      window.app.socketManager.emit("put:statusChanged", {
        userId:this.props.user.id,
        isOnline:status,
        reason:reason
      });
    }
  }

  onFocusChange () // Only works reliable on mobile ios (osx delivers weird results)
  {
    console.info('onFocusChange',document.hasFocus());
    if (document.hasFocus())
    {
      window.appMetrics['TTI'].setEnd(false,false, true);
      this.userStatusChanged(true,'FOCUS')
    }
    else
    {
      this.userStatusChanged(false,'BLUR')
    }
    if (document.hasFocus()) window.dispatchEvent(new CustomEvent('WindowFocus'));
  }

  // is used when app launches fresh (if only backgrounded then onFocusChange will handle event
  onPageShow ()
  {
    //window.appMetrics['TTI'].text = "PageShow";
    //window.appMetrics['TTI'].setEnd(false,false, true);
  }

  onVisibilityChange ()
  {
    console.info('isDocumentHidden',document.hidden);
    if (document.hidden)
    {
      //this.userStatusChanged(false,'DOC_HIDDEN')
    }
    else
    {
      //this.userStatusChanged(true,'DOC_SHOWN');
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
    <Progress></Progress>
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
    let { AsyncChatContainer, AsyncKPIDashboard, updateActive } = this.state;
    if (window.app.isKPIDashboard)
    {
      document.title = 'Pairly Chat KPIs';
      return <AsyncKPIDashboard></AsyncKPIDashboard>
    }
    //console.log('updateConfirmed',localStorage.getItem('updateConfirmed'))
    if (updateActive)
    {
      return <div className="updateActiveContainer">
        <h1>Installing Update...</h1>
      </div>
    }

    let props = {
      ref:(el => this.ref.chatContainer = el),
      sharedFiles:this.state.sharedFiles,
      removeFilePreview:this.removeFilePreview.bind(this),
      sendQueuedMsgs:this.sendQueuedMsgs.bind(this),
      onGetAppInfos:this.onGetAppInfos.bind(this),
      //wrappedComponentRef:(el => this.ref.chatContainer = el)
    };
    if (!AsyncChatContainer && !this.state.appReady)
    {
       return this.renderLoader()
    }
    return user ? <AsyncChatContainer {...props} /> : <Login onAuthSuccess={this.onAuthSuccess.bind(this)}></Login>
  }

  onGetAppInfos (appInfos)
  {
    console.info('onGetAppInfos',appInfos);
    window.app.appInfos = appInfos;
    this.checkForUpdate()
  }


  // Happens on Auth with socket and on received version from Service Worker, depending on what hapens last
  checkForUpdate ()
  {
    let appInfos = window.app.appInfos;
    //console.log('checkForUpdate', window.VERSION_SERVICE_WORKER,appInfos ? appInfos.swVersion : false);
    if (appInfos && window.VERSION_SERVICE_WORKER && window.VERSION_SERVICE_WORKER !== appInfos.swVersion && !localStorage.getItem('updateConfirmed'))
    {
      console.info('Update available',window.VERSION_SERVICE_WORKER,'=>',appInfos.swVersion);
      this.props.changeModal({type:'UPDATE'})
    }
  }

  renderModal ()
  {
    //console.log('renderModal',this.props.modal);
    if (this.props.modal.type === 'UPDATE')
    {
      let props = {
        type:'CONFIRM',
        header:'Update '+window.app.appInfos.swVersion+' available',
        content:"A new update for Pairly Chat is available. Do you want to install this update. The installation will only take a few seconds.",
        confirmAcceptTitle:'Install now',
        confirmRejectTitle:'Later',
        onAction:this.onModalAction.bind(this),
        modalKey:'UPDATE_MODAL'
      };
      return <Modal {...props} className={[]}></Modal>
    }
  }

  onModalAction (modal,action)
  {
    console.log('onModalAction',modal,'action',action)
    if (modal.props.modalKey === 'UPDATE_MODAL')
    {
      if (action === 'ACCEPT')
      {
        localStorage.setItem('updateConfirmed',1);
        window.location.reload()
      }
      this.props.changeModal(false);
    }
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
        {this.props.modal ? <div className="modalContainer">
          {this.renderModal() }
        </div> : false}
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
    changeModal: function (data)
    {
      return dispatch(changeModal(data));
    },
    changeConnection: function (data)
    {
      return dispatch(changeConnection(data));
    }
  }
};

//export default withRouter(App);
export default connect(mapStateToProps, mapDispatchToProps)(App);