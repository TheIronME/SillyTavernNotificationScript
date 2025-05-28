# 📢 SillyTavern 跨平台通知脚本

项目地址：[🌐 GitHub - SillyTavernNotificationScript](https://github.com/TheIronME/SillyTavernNotificationScript)

> **功能：** 在 SillyTavern 文本输出后自动发送通知提醒
>
> **依赖：** 酒馆助手+油猴脚本(移动端)

---

## ✅ 支持平台

- 🖥️ **PC端**
- 📱 **Android**
- 🍎 **iOS**（未测试）

---

## 🛠️ 工作原理

- **PC端：** 使用浏览器原生 Notifications API 实现通知
- **移动端：** 通过油猴脚本（Tampermonkey）桥接通知权限实现提醒

---

## 💻 推荐环境

### 🖥️ PC 端
- 支持浏览器：Chrome / Firefox / Edge  
- **无需 Tampermonkey 插件**

### 📱 Android
- ✅ Edge Dev + Tampermonkey（已验证）
- ⚠️ KiWi Browser + Violentmonkey（未经测试）

### 🍎 iOS
- ⚠️ Userscripts + Safari（未经测试）

---

## 📦 安装说明

1. **修改油猴脚本中的 `@match`**，确保匹配你使用的 SillyTavern 域名（PC端可跳过）  
   示例：
   ```js
   // @match https://sillytavern.asd666.xyz/
    ```

2. **导入油猴通知脚本**

3. **导入 SillyTavern 酒馆助手脚本**

---

## 📖 使用方法

1. 打开 **酒馆助手的脚本界面**
2. 找到本脚本一行，点击**通知按钮🔔**
3. **首次点击**将会请求通知权限
4. 如果成功弹出测试通知，说明配置成功 ✅

---

## ⚠️ 注意事项

权限要求如下：

### 🖥️ PC端

* 必须授权网站通知权限

### 📱 移动端

* 浏览器 APP 必须开启通知权限
* 浏览器内全局通知权限必须开启
* 网站通知权限必须授予
* 浏览器扩展应处于开发者模式（Tampermonkey）

---

## 🔗 参考项目

[💬 【酒馆助手脚本】角色输出完成时能够收到 iOS 系统通知](https://discord.com/channels/1291925535324110879/1366710275100774462/1366710275100774462)

---

## 📄 License

与酒馆助手脚本相同：
**Aladdin Free Public License (AFPL)**

