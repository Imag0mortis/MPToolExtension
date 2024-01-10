let interval;

// Создайте новый Event с помощью конструктора Event. Это будет ваш event bus.
let stataEvent = new Event('stata');

function sendMessageWithProductAside() {
  const productAside = document.querySelector('.product-page__aside-container');
  if (productAside) {
    window.postMessage({ productAside: productAside.innerHTML }, '*');
  }
}

function insertIframe() {
  const productAside = document.querySelector('.product-page__aside-container');
  if (productAside) {
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('index.html');
    iframe.style.width = '100%';
    iframe.style.height = '705px';
    iframe.style.border = 'none';
    productAside.insertAdjacentElement('beforeBegin', iframe);
    clearInterval(interval);

    // Добавьте обработчик событий для получения сообщений от iframe
    window.addEventListener('message', function(event) {
      // Убедитесь, что сообщение пришло от вашего iframe
      if (event.source === iframe.contentWindow) {
        // Отправьте данные обратно в iframe
        sendMessageWithProductAside();
      }
    });

    let stata = document.querySelector('.price-block__final-price');
    if (stata) {
      stataEvent.stataValue = stata.innerHTML;
      window.dispatchEvent(stataEvent);
    }
  }
}

interval = setInterval(insertIframe, 1000);

// Добавьте обработчик событий для прослушивания сообщений от родительской страницы и вывода данных о цене
window.addEventListener('stata', function(event) {
  console.log('Значение stata: ' + event.stataValue);
});
