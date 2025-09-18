importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

(function(){
    function d64(s){return atob(s);}
    const cfg = {
        apiKey: d64("QUl6YVN5REVrbkhNTHRSN3lHeWpmajFHRXJ5bjFXR3ZrTDlLNmlJ"),
        authDomain: d64("bm90aWZpY2F0aW9uLTkxZDQ3LmZpcmViYXNlYXBwLmNvbQ=="),
        projectId: d64("bm90aWZpY2F0aW9uLTkxZDQ3"),
        storageBucket: d64("bm90aWZpY2F0aW9uLTkxZDQ3LmFwcHNwb3QuY29t"),
        messagingSenderId: d64("OTMxODI2MTIyOTQ2"),
        appId: d64("MTkzMTgyNjEyMjk0Njp3ZWI6Nzg0MDkyNzgxMGY4NTQ0NzBlYmI1Yg=="),
        measurementId: d64("Ry0zMEpKRlJETlNY")
    };
    
    firebase.initializeApp(cfg);
    const msg = firebase.messaging();

    msg.onBackgroundMessage(function(p){
        if(p.data){
            const d=p.data;
            self.registration.showNotification(d.title||"No title",{
                body:d.body||"",
                icon:d.icon||"",
                tag:"custom-notification"
            });
        }
    });

    self.addEventListener("push",function(e){
        if(e.data){
            e.stopImmediatePropagation();
            const pl=e.data.json();
            if(pl.data){
                e.waitUntil(self.registration.showNotification(pl.data.title,{
                    body:pl.data.body,
                    icon:pl.data.icon,
                    tag:"custom-notification"
                }));
            }
        }
    });
})();
