const firebaseConfig = {
  apiKey:            "AIzaSyDEknhMLtR7yGyjfjI3Reyn1WGvkL9K6aI",
  authDomain:        "notification-91d47.firebaseapp.com",
  projectId:         "notification-91d47",
  storageBucket:     "notification-91d47.appspot.com",
  messagingSenderId: "931826122946",
  appId:             "1:931826122946:web:7840927810f854470ebb5b",
  measurementId:     "G-30JJFRDNSX"
};

const VAPID_KEY = "BNdpNyxjim_8r4LfhR08n9bEOrr5dcw5iOcomnqufFoXV6sK0x4qxDmaEv1Fh3Tta4czYsSvMR9UQMZqS7KKxUo";

self.firebaseConfig = firebaseConfig;

export { firebaseConfig, VAPID_KEY };           
