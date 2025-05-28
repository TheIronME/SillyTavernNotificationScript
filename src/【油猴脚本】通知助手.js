// ==UserScript==
// @name         酒馆通知助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  通知助手的油猴脚本部分，请结合通知助手的酒馆助手部分使用
// @author       TheIronME
// @match        https://repalceyourdomin.com/
// @grant        GM_notification
// ==/UserScript==

(function () {
    'use strict';

    const NOTIFICATION_BRIDGE_ID = "tampermonkey-notification-bridge";
    const DEBUG_LOGGING = true; // Set to true to see console logs

    function logTampermonkey(...args) {
        if (DEBUG_LOGGING) {
            console.log("[TampermonkeyNotifier]", ...args);
        }
    }

    logTampermonkey("Tampermonkey script loaded.");

    // Function to handle the notification
    function handleNotification(data) {
        if (data && typeof data === 'object' && data.title && data.message) {
            logTampermonkey("Received notification data:", data);
            GM_notification({
                title: data.title,
                text: data.message,
                image: data.icon || '',
                timeout: 5000,
                onclick: function () {
                    logTampermonkey("Notification clicked!");
                    // Optional: You can add logic here to focus the tab or navigate
                }
            });
        } else {
            logTampermonkey("Invalid notification data received:", data);
        }
    }

    // Use a MutationObserver to watch for changes to the bridge element
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const bridgeElement = document.getElementById(NOTIFICATION_BRIDGE_ID);
                if (bridgeElement && bridgeElement.innerText) {
                    try {
                        const notificationData = JSON.parse(bridgeElement.innerText);
                        handleNotification(notificationData);
                        // Clear the content after processing to ensure future changes are detected
                        bridgeElement.innerText = '';
                    } catch (e) {
                        logTampermonkey("Error parsing notification data:", e);
                    }
                }
            }
        });
    });

    // Start observing the body for the bridge element to be added, then observe the element itself.
    // This handles cases where the bridge element might not exist immediately on script load.
    const bodyObserver = new MutationObserver(function (mutations, obs) {
        const bridgeElement = document.getElementById(NOTIFICATION_BRIDGE_ID);
        if (bridgeElement) {
            logTampermonkey("Notification bridge element found. Starting observation.");
            // Stop observing the body once the element is found
            obs.disconnect();

            // Observe changes to the bridge element's child nodes (for text content changes)
            observer.observe(bridgeElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    });

    // Start observing the entire document body for changes in its children
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Also try to find the element immediately in case it's already there
    const initialBridgeElement = document.getElementById(NOTIFICATION_BRIDGE_ID);
    if (initialBridgeElement) {
        logTampermonkey("Notification bridge element found on initial load.");
        observer.observe(initialBridgeElement, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
})();