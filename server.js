const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

// 模拟Lua处理库，实际需引入真实可用库
const luaObfuscate = (code) => `// 模拟混淆后的代码: ${code}`;
const luaDecompile = (code) => `// 模拟反编译后的代码: ${code}`;
// 其他功能函数同理

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 用于存储文件切片
const fileChunks = {};

app.post('/upload', upload.array('file'), (req, res) => {
    const functionType = req.body.functionType;
    const chunkIndex = parseInt(req.body.chunkIndex);
    const file = req.files[0];
    const fileContent = file.buffer.toString('utf8');
    if (!fileChunks[functionType]) {
        fileChunks[functionType] = [];
    }
    fileChunks[functionType][chunkIndex] = fileContent;
    // 检查所有切片是否都已上传
    const allChunksReceived = fileChunks[functionType].length === 3;
    if (allChunksReceived) {
        let completeFileContent = '';
        for (let i = 0; i < fileChunks[functionType].length; i++) {
            completeFileContent += fileChunks[functionType][i];
        }
        let result;
        switch (functionType) {
            case 'obfuscate':
                result = luaObfuscate(completeFileContent);
                break;
            case 'decompile':
                result = luaDecompile(completeFileContent);
                break;
            // 其他功能处理
            default:
                result = '暂未实现该功能';
        }
        // 模拟保存处理后的文件（实际应按需求存储）
        const tempFilePath = path.join(__dirname, 'tempResult.txt');
        require('fs').writeFileSync(tempFilePath, result);
        res.status(200).send('上传及处理成功');
    } else {
        res.status(200).send('切片上传中');
    }
});

app.post('/uploadText', (req, res) => {
    const functionType = req.body.functionType;
    const text = req.body.text;
    let result;
    switch (functionType) {
        case 'obfuscate':
            result = luaObfuscate(text);
            break;
        case 'decompile':
            result = luaDecompile(text);
            break;
        // 其他功能处理
        default:
            result = '暂未实现该功能';
    }
    // 模拟保存处理后的文本（实际应按需求存储）
    const tempFilePath = path.join(__dirname, 'tempResult.txt');
    require('fs').writeFileSync(tempFilePath, result);
    res.status(200).send('文本处理成功');
    // 向前端发送处理结果
    const script = `displayResult('${result.replace(/'/g, "\\'")}');`;
    res.send(`<script>${script}</script>`);
});

app.get('/download', (req, res) => {
    const { start, end, functionType } = req.query;
    const tempFilePath = path.join(__dirname, 'tempResult.txt');
    const file = require('fs').readFileSync(tempFilePath);
    const chunk = file.slice(parseInt(start), parseInt(end));
    res.set('Content-Type', 'application/octet-stream');
    res.send(chunk);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
