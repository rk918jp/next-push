import { util } from './util';
import { io } from "socket.io-client";

declare let self: ServiceWorkerGlobalScope

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
//
// self.__WB_DISABLE_DEV_LOGS = true

util();

console.log("Worker loaded");

self.addEventListener('activate', (event) => {
  setInterval(() => {
    self.registration.showNotification("activate", {
      body: "body",
      icon: '/icons/android-chrome-192x192.png'
    })
  }, 30000);

  console.log("WS instance created");
  let webSocket = new WebSocket("ws://localhost:3002");
  const handleOpen = () => {
    console.log("WS connection open");
    self.registration.showNotification("Connection opened", {
      body: "body",
      icon: '/icons/android-chrome-192x192.png'
    })
  };
  const handleMessage = (e: MessageEvent) => {
    console.log("message", e);
    self.registration.showNotification("Message received", {
      body: "body",
      icon: '/icons/android-chrome-192x192.png'
    });
  }
  const handleClose = () => {
    webSocket = new WebSocket("ws://localhost:3002");
  }
  webSocket.addEventListener('open', handleOpen);
  webSocket.addEventListener('message', handleMessage);
  webSocket.addEventListener('close', handleClose);

  // NOTE: socket.ioでの接続は不可能
  // const socket = io("http://localhost:3001");
  // socket.on("connect", () => {
  //   console.log("socket connected");
  //   self.registration.showNotification("connect", {
  //     body: "body",
  //     icon: '/icons/android-chrome-192x192.png'
  //   })
  // });
  // socket.on("subscribe", (data: any) => {
  //   console.log(data);
  //   self.registration.showNotification("subscribe", {
  //     body: "body",
  //     icon: '/icons/android-chrome-192x192.png'
  //   })
  // })
});

// listen to message event from window
self.addEventListener('message', event => {
  // HOW TO TEST THIS?
  // Run this in your browser console:
  //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
  // OR use next-pwa injected workbox object
  //     window.workbox.messageSW({command: 'log', message: 'hello world'})
  console.log(event?.data);
  const data = event?.data;
  event?.waitUntil(
    self.registration.showNotification(data.message, {
      body: data.message,
      icon: '/icons/android-chrome-192x192.png'
    })
  )
});

self.addEventListener('push',  (event) => {
  // const data = JSON.parse(event?.data.text() || '{}')
  event?.waitUntil(
    self.registration.showNotification("push", {
      body: "message",
      icon: '/icons/android-chrome-192x192.png'
    })
  )
})

self.addEventListener('notificationclick',  (event) => {
  event?.notification.close()
  event?.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0]
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i]
          }
        }
        return client.focus()
      }
      return self.clients.openWindow('/')
    })
  )
})
