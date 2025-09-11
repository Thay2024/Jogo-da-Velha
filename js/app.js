
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
import {initializeApp} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {getMessaging} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX3v0UTgBvmNSAJ7quOSsOkt_x2KLJprc",
  authDomain: "notifq-pwa.firebaseapp.com",
  projectId: "notifq-pwa",
  storageBucket: "notifq-pwa.firebasestorage.app",
  messagingSenderId: "1059584773060",
  appId: "1:1059584773060:web:0361e047071511fef2f291",
  measurementId: "G-W1JG5F4RV0"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function solicitarPermissao() {
    Notification.requestPermission().then((permissao) => {
        if (permissao === 'granted') {
            console.log('Permissão concedida para notificações.');

            messaging.getToken({ vapidKey: "BNpatdXmEmL7i2RxOC_hd6ShgaIxcbEC5yZcA2c1OlVWBNs5AsZ9LpdDF0qSWi-ClDw-SL046zG_Ju37QaGVAJs" 

            }).then((cToken) => {
                if (cToken) {
                    console.log('Token do dispositivo: OK');
                    alert(cToken);
                } else {
                    console.log('Nenhum token disponível! ');
                }
            }).catch((erro) => {
                console.error('Erro ao obter token', erro);
                });
            } else {
                console.log('Permissão negada!');
            }
        });
    }

    const btn_permissao = document.getElementById('btn-permissao');
    btn_permissao.addEventListener('click', solicitarPermissao());

