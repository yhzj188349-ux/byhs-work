const fs = require('fs');
const https = require('https');

// 修复单个PNG图片
function fixSinglePng() {
    const imageName = '漫展票务B.png';
    const imagePath = 'C:\\Users\\52289\\Desktop\\b站商城max\\商城首页\\images\\' + imageName;
    const imageUrl = 'https://picsum.photos/id/11/400/400';
    
    console.log(`开始修复 ${imageName}...`);
    
    // 先删除无效的文件
    if (fs.existsSync(imagePath)) {
        try {
            fs.unlinkSync(imagePath);
            console.log(`已删除无效文件: ${imageName}`);
        } catch (error) {
            console.error(`删除文件失败: ${error.message}`);
            return;
        }
    }
    
    // 下载新图片
    const file = fs.createWriteStream(imagePath);
    
    https.get(imageUrl, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            console.log(`重定向到: ${response.headers.location}`);
            https.get(response.headers.location, (redirectResponse) => {
                if (redirectResponse.statusCode === 200) {
                    redirectResponse.pipe(file);
                    
                    file.on('finish', () => {
                        file.close(() => {
                            console.log(`下载完成: ${imageName}`);
                            // 检查文件大小
                            const stats = fs.statSync(imagePath);
                            console.log(`文件大小: ${stats.size} 字节`);
                            console.log(`修复完成！`);
                        });
                    });
                } else {
                    console.error(`下载失败，状态码: ${redirectResponse.statusCode}`);
                }
            });
        } else if (response.statusCode === 200) {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close(() => {
                    console.log(`下载完成: ${imageName}`);
                    const stats = fs.statSync(imagePath);
                    console.log(`文件大小: ${stats.size} 字节`);
                    console.log(`修复完成！`);
                });
            });
        } else {
            console.error(`下载失败，状态码: ${response.statusCode}`);
        }
    }).on('error', (error) => {
        console.error(`下载出错: ${error.message}`);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    });
}

// 执行修复
fixSinglePng();