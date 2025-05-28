// ======================
// 配置参数
// ======================
const ICON_URL = "img/logo.png"; // 图标URL
const enableLogging = true; // 调试日志开关
// ======================
// 消息模板库
const MESSAGE_TEMPLATES = [
    "💬 {charName}等待您的回复",
    "{charName}分享了新的想法✨",
    "👀 您关注的主播{charName}突然开播！",
    "🔞 {charName}的18+付费内容预览...",
    "🖋️ {charName}在故事中写下新篇",
    "🌃 {charName}的午夜电台正在播放您的黑历史",
    "{charName}发给您的快递📦️已经送达，请尽快签收",
    "📱 {charName}邀请您加入对话",
    "{charName}的聊天记录已加密🔐 请输入密码*******查看",
    "收到来自{charName}的精神损失费账单🧾，请及时赔付",
    "🎉 {charName}的周年庆邀请函已送达，点击查看特权",
    "🚨 紧急！{charName}的聊天室出现未读高危消息",
    "🎁 您有来自{charName的未领取礼物（剩余24小时）",
    "🔔 {charName}的定时提醒：该喝水休息啦！",
    "🎈 生日惊喜！{charName}准备了特别祝福",
    "🔍 检测到{charName}的历史聊天中有敏感词回溯",
    "🌧️ {charName}的雨季限定故事已更新",
    "🛎️ 您预约的{charName}专属服务已就绪",
    "❄️ {charName}的雪国篇章新增互动选项",
    "🕵️♂️ 匿名用户正在窥探{charName}的聊天记录"
];
// ======================
// 全局变量
// ======================
const NOTIFICATION_COOLDOWN = 5000; // 5秒通知冷却（无用）
let lastNotificationTime = 0;
const IS_MOBILE = isMobileDevice()
const NOTIFICATION_BRIDGE_ID = "tampermonkey-notification-bridge";
// ======================
// 工具函数
// ======================
function log(...args) {
    enableLogging && console.log("[NativeNotifier]", ...args);
}

function logError(...args) {
    enableLogging && console.error("[NativeNotifier]", ...args);
}

function isNotificationSupported() {
    return "Notification" in window;
}
function isMobileDevice() {
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const hasOrientation = typeof window.orientation !== 'undefined';
    const userAgentDataMobile = navigator.userAgentData ? navigator.userAgentData.mobile : undefined;
    const touchEventSupported = 'ontouchstart' in window;
  
    if (userAgentDataMobile === true) {
      return true;
    }
    if (
      (maxTouchPoints > 0 || touchEventSupported) &&
      (hasOrientation)
    ) {
      return true;
    }
  
    return false;
  }
  
// ======================
// 初始化通知按钮
// ======================
function initNotificationButton() {
    const parentDoc = window.parent.document;
    const targetComponent = parentDoc.getElementById("2d7b624b-cbbd-4cb8-ac36-c63621ded94e");

    if (!targetComponent) {
        logError("未找到目标组件");
        return;
    }

    const controlDiv = targetComponent.querySelector(".script-item-control");
    if (!controlDiv) {
        logError("未找到script-item-control div");
        return;
    }

    // 创建按钮元素
    const button = document.createElement("button");
    button.className = "menu_button interactable";
    button.innerHTML = "🔔";

    // 按钮点击事件处理
    button.addEventListener("click", async () => {
        if (!isNotificationSupported()) {
            alert("您的浏览器不支持通知功能");
            return;
        }
        log("点击通知按钮"); // 添加日志
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            await showNativeNotification("SillyTavern", "通知权限已启用");
            button.innerHTML = "🔔";
            button.style.backgroundColor = "#2196F3";
        } else {
            alert("您拒绝了通知权限");
        }
    });

    controlDiv.appendChild(button);
    log("通知按钮已创建");
}


// ======================
// 核心功能函数
// ======================
async function showNativeNotification(title, body) {
    const now = Date.now();
    if (now - lastNotificationTime < NOTIFICATION_COOLDOWN) {
        log(`通知冷却中，跳过 (${(now - lastNotificationTime) / 1000}秒/${NOTIFICATION_COOLDOWN / 1000}秒)`);
        return;
    }

    try {
        const charData = await getCharData();
        if (!charData) {
            logError("获取角色数据失败");
        }

        const charName = charData?.name || "AI";
        const processedBody = body.replace(/{charName}/g, charName);

        if (!(await requestNotificationPermission())) {
            logError("通知权限未授予");
            return;
        }
        if (IS_MOBILE) { // Enable this condition
            log("显示移动端通知");
            showMobileNotification(title, processedBody);
            return;
        }
        if ("Notification" in window && Notification.permission === "granted") {
            log("显示PC端通知");
            new Notification(title, {
                body: processedBody,
                icon: ICON_URL,
            });
            lastNotificationTime = now;
            log("通知已发送");
        } else {
            logError("PC端通知权限未授予");
        }
    } catch (e) {
        logError("显示通知异常:", e);
    }
}
// ======================
// 移动端通知组件
// ======================
function showMobileNotification(title, message) {
    const parentDoc = window.parent.document;
    let bridgeElement = parentDoc.getElementById(NOTIFICATION_BRIDGE_ID);
    if (!bridgeElement) {
        bridgeElement = parentDoc.createElement("div");
        bridgeElement.id = NOTIFICATION_BRIDGE_ID;
        // Make it hidden but part of the DOM
        bridgeElement.style.display = "none";
        parentDoc.body.appendChild(bridgeElement);
    }
    // Update the content to trigger the Tampermonkey script's listener
    bridgeElement.innerText = JSON.stringify({ title, message, icon: ICON_URL });
    log("Mobile notification triggered via bridge:", { title, message });
}


// ======================
// 权限管理系统
// ======================
async function requestNotificationPermission() {
    if (!isNotificationSupported()) {
        if (IS_MOBILE) {
            alert('请启用通知权限(APP通知权限、浏览器内全局通知权限、浏览器内站点通知权限)');
        }
        return false;
    }
    return (await Notification.requestPermission()) === "granted";
}
$(async () => {
    // ======================
    // 事件监听系统
    // ======================
    log("初始化事件监听系统...");
    log("IS_MOBILE:", IS_MOBILE);

    // 初始化通知桥接元素
    const parentDoc = window.parent.document;
    let bridgeElement = parentDoc.getElementById(NOTIFICATION_BRIDGE_ID);
    if (!bridgeElement) {
        bridgeElement = parentDoc.createElement("div");
        bridgeElement.id = NOTIFICATION_BRIDGE_ID;
        bridgeElement.style.display = "none";
        parentDoc.body.appendChild(bridgeElement);
        log("创建通知桥接元素");
    }

    initNotificationButton();
    log("系统初始化完成");
    eventOn(tavern_events.MESSAGE_RECEIVED, () => {
        log("检测到新消息事件");

        setTimeout(() => {
            const $lastMessage = $('.mes').last();

            if ($lastMessage.length === 0) {
                log("未找到消息元素");
                return;
            }

            if (!$lastMessage.hasClass('user')) {
                log("检测到AI消息，发送通知");
                const template = MESSAGE_TEMPLATES[Math.floor(Math.random() * MESSAGE_TEMPLATES.length)];
                showNativeNotification("SillyTavern", template);
            }
        }, 100);
    });

});