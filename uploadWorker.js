// uploadWorker.js
self.onmessage = function (e) {
    const { formData, start, end } = e.data;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            self.postMessage('done');
        }
    };
};
