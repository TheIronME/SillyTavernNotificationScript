// ==UserScript==
// @name         酒馆通知助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  通知助手的油猴脚本部分，请结合通知助手的酒馆助手部分使用
// @author       TheIronME
// @match        https://repalceyourdomin.com/
// @grant        GM_notification
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const NOTIFICATION_BRIDGE_ID = 'tampermonkey-notification-bridge';
    const DEBUG_LOGGING = false;  // 发布时可设为 false

    function log(...args) {
        if (DEBUG_LOGGING) console.log('[TampermonkeyNotifier]', ...args);
    }

    function sendNotification({ title, message, icon }) {
        // 设置 timeout 仍可尝试传参，但多数安卓环境下会被系统忽略
        GM_notification({
            title: title,
            text: message,
            image: icon || '',
            timeout: 10000,
            onclick: function () {
                log("Notification clicked!");
                // Optional: You can add logic here to focus the tab or navigate
            }
        });
        log('Notification sent:', title, message);
    }

    function observeBridge(bridgeEl) {
        const obs = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                if (bridgeEl.innerText.trim()) {
                    try {
                        const data = JSON.parse(bridgeEl.innerText);
                        if (data.title && data.message) {
                            sendNotification({ title: data.title, message: data.message, icon: data.icon });
                        } else {
                            log('Invalid data format:', data);
                        }
                    } catch (e) {
                        log('JSON parse error:', e);
                    }
                    // 清空内容，准备下次通知
                    bridgeEl.innerText = '';
                }
            });
        });
        obs.observe(bridgeEl, { childList: true, characterData: true, subtree: true });
        log('Started observing bridge element.');
    }

    function init() {
        const bridgeEl = document.getElementById(NOTIFICATION_BRIDGE_ID);
        if (bridgeEl) {
            log('Bridge element found.');
            observeBridge(bridgeEl);
        } else {
            log('Bridge element not yet available, retrying in 500ms...');
            setTimeout(init, 500);
        }
    }

    // 启动初始化流程
    init();
})();
