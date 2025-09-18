importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

(function(){
    function d64(s){return atob(s);}
    const c = {
        k: d64("QUl6YVN5REVrbkhNTHRSN3lHeWpmajFHRXJ5bjFXR3ZrTDlLNmlJ"),
        a: d64("bm90aWZpY2F0aW9uLTkxZDQ3LmZpcmViYXNlYXBwLmNvbQ=="),
        p: d64("bm90aWZpY2F0aW9uLTkxZDQ3"),
        s: d64("bm90aWZpY2F0aW9uLTkxZDQ3LmFwcHNwb3QuY29t"),
        m: d64("OTMxODI2MTIyOTQ2"),
        i: d64("MTkzMTgyNjEyMjk0NjplYjpiYzdhZDQwNzQ1YjU0NTNkY2UyNDU3YjNk"),
        g: d64("Ry0zMEpKRlJETlNY")
    };
    
    firebase.initializeApp({
        apiKey: c.k,
        authDomain: c.a,
        projectId: c.p,
        storageBucket: c.s,
        messagingSenderId: c.m,
        appId: c.i,
        measurementId: c.g
    });

    const m = firebase.messaging();

    m.onBackgroundMessage(function(p){
        if(p.data){
            const {title:t, body:b, icon:i} = p.data;
            self.registration.showNotification(t||"No title",{
                body:b||"",
                icon:i||"",
                tag:Date().toString(),
                renotify:false
            });
        }
    });

    self.addEventListener("push", function(e){
        if(e.data){
            const pl = e.data.json();
            if(pl.data){
                const {title:t, body:b, icon:i} = pl.data;
                e.waitUntil(self.registration.showNotification(t||"No title",{
                    body:b||"",
                    icon:i||"",
                    tag:Date().toString(),
                    renotify:false,
                    requireInteraction:true
                }));
            }
        }
    });
})();
