const fs = require('fs');
const path = require('path');
const https = require('https');

// 图片目录路径
const mallIndexDir = path.join('C:\\Users\\52289\\Desktop\\b站商城max\\商城首页\\images');

// 需要重新下载的图片信息
const imagesToDownload = [
    { name: '手办模型A.jpg', url: 'https://picsum.photos/id/1/400/400' },
    { name: '手办模型B.jpg', url: 'https://picsum.photos/id/2/400/400' },
    { name: '手办模型C.jpg', url: 'https://picsum.photos/id/3/400/400' },
    { name: '手办模型D.jpg', url: 'https://picsum.photos/id/4/400/400' },
    { name: '新品预售A.jpg', url: 'https://picsum.photos/id/5/400/400' },
    { name: '新品预售B.jpg', url: 'https://picsum.photos/id/6/400/400' },
    { name: '漫展票务A.jpg', url: 'https://picsum.photos/id/7/400/400' },
    { name: '漫展票务B.png', url: 'https://picsum.photos/id/8/400/400' },
    { name: '虚拟偶像A.jpg', url: 'https://picsum.photos/id/9/400/400' },
    { name: '虚拟偶像B.jpg', url: 'https://picsum.photos/id/10/400/400' }
];

// 检查文件是否有效
function isImageValid(filePath) {
    try {
        const stats = fs.statSync(filePath);
        // 如果文件太小或者不是有效的图片格式，认为无效
        if (stats.size < 1024) return false;
        
        const buffer = fs.readFileSync(filePath, { encoding: null, flag: 'r' });
        const ext = path.extname(filePath).toLowerCase();
        
        if (ext === '.jpg' || ext === '.jpeg') {
            return buffer[0] === 0xFF && buffer[1] === 0xD8;
        } else if (ext === '.png') {
            return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
        }
        return false;
    } catch (error) {
        return false;
    }
}

// 删除无效图片
function deleteInvalidImages() {
    console.log('删除无效图片...');
    try {
        const files = fs.readdirSync(mallIndexDir);
        let deletedCount = 0;
        
        for (const file of files) {
            const filePath = path.join(mallIndexDir, file);
            if (fs.statSync(filePath).isFile()) {
                const isValid = isImageValid(filePath);
                console.log(`${file}: ${isValid ? '有效' : '无效，将删除'}`);
                if (!isValid) {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                }
            }
        }
        console.log(`已删除 ${deletedCount} 个无效图片文件\n`);
    } catch (error) {
        console.error('删除无效图片时出错:', error.message);
    }
}

// 下载单个图片（处理重定向）
function downloadImage(imageInfo) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(mallIndexDir, imageInfo.name);
        console.log(`开始下载: ${imageInfo.name} 从 ${imageInfo.url}`);
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };
        
        https.get(imageInfo.url, options, (response) => {
            // 处理重定向
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                console.log(`重定向到: ${response.headers.location}`);
                // 跟随重定向
                https.get(response.headers.location, options, (redirectResponse) => {
                    if (redirectResponse.statusCode !== 200) {
                        // 不要尝试删除不存在的文件
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                        reject(new Error(`重定向后请求失败，状态码: ${redirectResponse.statusCode}`));
                        return;
                    }
                    
                    const file = fs.createWriteStream(filePath);
                    redirectResponse.pipe(file);
                    
                    file.on('finish', () => {
                        file.close(() => {
                            console.log(`下载完成: ${imageInfo.name}`);
                            resolve(imageInfo.name);
                        });
                    });
                }).on('error', (error) => {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    reject(error);
                });
            } else if (response.statusCode === 200) {
                const file = fs.createWriteStream(filePath);
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close(() => {
                        console.log(`下载完成: ${imageInfo.name}`);
                        resolve(imageInfo.name);
                    });
                });
            } else {
                // 不要尝试删除不存在的文件
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                reject(new Error(`请求失败，状态码: ${response.statusCode}`));
            }
        }).on('error', (error) => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            reject(error);
        });
    });
}

// 下载所有图片
async function downloadAllImages() {
    console.log('开始下载图片...');
    let successCount = 0;
    let failCount = 0;
    
    for (const imageInfo of imagesToDownload) {
        try {
            await downloadImage(imageInfo);
            successCount++;
        } catch (error) {
            console.error(`下载 ${imageInfo.name} 失败:`, error.message);
            failCount++;
        }
    }
    
    console.log(`\n下载完成: 成功 ${successCount}, 失败 ${failCount}\n`);
}

// 验证下载的图片
function verifyDownloadedImages() {
    console.log('验证下载的图片...');
    let validCount = 0;
    let invalidCount = 0;
    
    for (const imageInfo of imagesToDownload) {
        const filePath = path.join(mallIndexDir, imageInfo.name);
        if (fs.existsSync(filePath)) {
            const isValid = isImageValid(filePath);
            console.log(`${imageInfo.name}: ${isValid ? '✓ 有效' : '✗ 无效'}`);
            if (isValid) {
                validCount++;
            } else {
                invalidCount++;
            }
        } else {
            console.log(`${imageInfo.name}: ✗ 文件不存在`);
            invalidCount++;
        }
    }
    
    console.log(`\n验证结果: 有效 ${validCount}, 无效 ${invalidCount}`);
}

// 主函数
async function main() {
    try {
        // 删除无效图片
        deleteInvalidImages();
        
        // 下载新图片
        await downloadAllImages();
        
        // 验证下载结果
        verifyDownloadedImages();
        
        console.log('\n图片修复完成！');
    } catch (error) {
        console.error('执行过程中出错:', error.message);
    }
}

// 执行主函数
main();