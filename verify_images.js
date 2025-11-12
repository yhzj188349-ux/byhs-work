const fs = require('fs');
const path = require('path');

// 图片目录路径
const productDetailDir = 'C:\\Users\\52289\\Desktop\\b站商城max\\商品详情页\\images';
const mallIndexDir = 'C:\\Users\\52289\\Desktop\\b站商城max\\商城首页\\images';

// 检查文件头的函数
function checkFileSignature(filePath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath, { start: 0, end: 10 });
        let chunk;
        
        fileStream.on('data', (data) => {
            chunk = data;
            fileStream.destroy();
        });
        
        fileStream.on('close', () => {
            if (!chunk) {
                resolve({ valid: false, reason: '无法读取文件' });
                return;
            }
            
            const ext = path.extname(filePath).toLowerCase();
            
            // 检查JPEG文件头 (FF D8)
            if (ext === '.jpg' || ext === '.jpeg') {
                const isJpeg = chunk[0] === 0xFF && chunk[1] === 0xD8;
                resolve({ valid: isJpeg, type: isJpeg ? 'JPEG' : '未知', header: chunk.slice(0, 2).toString('hex') });
            }
            // 检查PNG文件头 (89 50 4E 47)
            else if (ext === '.png') {
                const isPng = chunk[0] === 0x89 && chunk[1] === 0x50 && chunk[2] === 0x4E && chunk[3] === 0x47;
                resolve({ valid: isPng, type: isPng ? 'PNG' : '未知', header: chunk.slice(0, 4).toString('hex') });
            }
            else {
                resolve({ valid: false, type: '不支持的格式', header: chunk.toString('hex') });
            }
        });
        
        fileStream.on('error', (err) => {
            resolve({ valid: false, reason: err.message });
        });
    });
}

// 验证指定目录的图片
async function verifyDirectory(dirPath, dirName) {
    console.log(`验证${dirName}图片:`);
    console.log('='.repeat(60));
    
    try {
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isFile()) {
                const stats = fs.statSync(filePath);
                const result = await checkFileSignature(filePath);
                
                console.log(`文件名: ${file}`);
                console.log(`大小: ${stats.size.toLocaleString()} 字节`);
                console.log(`状态: ${result.valid ? '✓ 有效' : '✗ 无效'}`);
                if (result.type) console.log(`类型: ${result.type}`);
                if (result.header) console.log(`文件头: ${result.header}`);
                if (result.reason) console.log(`原因: ${result.reason}`);
                console.log('-'.repeat(60));
            }
        }
    } catch (error) {
        console.error(`验证${dirName}过程中出错:`, error.message);
    }
}

// 执行验证
async function verifyAllImages() {
    await verifyDirectory(productDetailDir, '商品详情页');
    console.log('\n' + '='.repeat(60));
    await verifyDirectory(mallIndexDir, '商城首页');
}

verifyAllImages();