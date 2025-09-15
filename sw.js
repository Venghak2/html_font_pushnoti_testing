importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

(function() {
  'use strict';
  
  // Fixed obfuscation mapping
  var _0x1a2b = [
    'addEventListener',    // 0x0
    'data',              // 0x1  
    'type',              // 0x2
    'FIREBASE_CONFIG',   // 0x3
    'config',            // 0x4
    'firebaseConfig',    // 0x5
    'error',             // 0x6
    'Firebase config not available in service worker', // 0x7
    'initializeApp',     // 0x8
    'messaging',         // 0x9
    'onBackgroundMessage', // 0xa
    'registration',      // 0xb
    'showNotification',  // 0xc
    'title',             // 0xd
    'Notification',      // 0xe
    'body',              // 0xf
    '/icon-192.png',     // 0x10
    'message'            // 0x11
  ];
  
  var _0x3c4d = function(_0x1a2b, _0x5e6f) {
    return _0x1a2b[_0x1a2b];
  };
  
  var _0xabcd = {};
  
  // Listen for config message from main thread
  self[_0x1a2b[0x0]](_0x1a2b[0x11], function(_0xef12) {
    if (_0xef12[_0x1a2b[0x1]] && _0xef12[_0x1a2b[0x1]][_0x1a2b[0x2]] === _0x1a2b[0x3]) {
      _0xabcd = _0xef12[_0x1a2b[0x1]][_0x1a2b[0x4]];
      _0x1234();
    }
  });
  
  // Check if config is already available
  if (self[_0x1a2b[0x5]]) {
    _0xabcd = self[_0x1a2b[0x5]];
    _0x1234();
  }
  
  function _0x1234() {
    if (!_0xabcd) {
      console[_0x1a2b[0x6]](_0x1a2b[0x7]);
      return;
    }
    
    var _0x5678 = firebase[_0x1a2b[0x8]](_0xabcd);
    var _0x9abc = firebase[_0x1a2b[0x9]]();
    
    _0x9abc[_0x1a2b[0xa]](function(_0xdef0) {
      var _0x1122 = _0xdef0.notification;
      self[_0x1a2b[0xb]][_0x1a2b[0xc]](_0x1122[_0x1a2b[0xd]] || _0x1a2b[0xe], {
        body: _0x1122[_0x1a2b[0xf]],
        icon: _0x1a2b[0x10]
      });
    });
  }
})();