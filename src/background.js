// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.price) {
    // В этом месте вы можете выполнить действия, связанные с полученной ценой,
    // например, отправить цену в ваш Angular-компонент через расширенный объект сообщения
    // или выполнить другие действия с ценой.
  }
});