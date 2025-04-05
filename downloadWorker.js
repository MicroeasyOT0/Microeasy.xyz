// downloadWorker.js
self.onmessage = function (e) {
    const { start, end, functionType } = e.data;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/download?start=${start}&end=${end}&functionType=${functionType}`, true);
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            self.postMessage(xhr.response);
        }
    };
};
