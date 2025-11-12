const fs = require('fs');

// 验证图片文件是否有效
function verifyImage(filePath) {
    try {
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
            return { valid: false, reason: '文件为空' };
        }
        
        // 读取文件头进行格式验证
        const buffer = Buffer.alloc(8);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 8, 0);
        fs.closeSync(fd);
        
        // 检查文件头
        const fileHeader = buffer.toString('hex');
        let type = '未知';
        let isValid = false;
        
        if (fileHeader.startsWith('ffd8')) {
            type = 'JPEG';
            isValid = true;
        } else if (fileHeader.startsWith('89504e47')) {
            type = 'PNG';
            isValid = true;
        }
        
        return {
            valid: isValid,
            size: stats.size,
            type: type,
            header: fileHeader.substring(0, 8)
        };
    } catch (error) {
        return { valid: false, reason: error.message };
    }
}

// 验证目录中的所有图片
function verifyDirectory(dirPath) {
    console.log(`\n验证目录: ${dirPath}`);
    console.log('='.repeat(60));
    
    try {
        const files = fs.readdirSync(dirPath);
        let validCount = 0;
        let invalidCount = 0;
        
        files.forEach(file => {
            const filePath = dirPath + '\\' + file;
            const stats = fs.statSync(filePath);
            
            if (stats.isFile() && (file.endsWith('.jpg') || file.endsWith('.png'))) {
                const result = verifyImage(filePath);
                const status = result.valid ? '✓ 有效' : '✗ 无效';
                
                console.log(`${file}: ${status}`);
                if (result.valid) {
                    console.log(`  - 类型: ${result.type}`);
                    console.log(`  - 大小: ${result.size.toLocaleString()} 字节`);
                    console.log(`  - 文件头: ${result.header}`);
                    validCount++;
                } else {
                    console.log(`  - 原因: ${result.reason || result.header}`);
                    invalidCount++;
                }
                console.log('-' + '-'.repeat(58));
            }
        });
        
        console.log(`验证结果: 有效 ${validCount}, 无效 ${invalidCount}`);
        return { valid: validCount, invalid: invalidCount };
    } catch (error) {
        console.error(`验证目录失败: ${error.message}`);
        return { valid: 0, invalid: 0 };
    }
}

// 主函数
function main() {
    const dirs = [
        'C:\\Users\\52289\\Desktop\\b站商城max\\商品详情页\\images',
        'C:\\Users\\52289\\Desktop\\b站商城max\\商城首页\\images'
    ];
    
    let totalValid = 0;
    let totalInvalid = 0;
    
    dirs.forEach(dir => {
        const result = verifyDirectory(dir);
        totalValid += result.valid;
        totalInvalid += result.invalid;
    });
    
    console.log('\n=== 总体验证结果 ===');
    console.log(`总共验证: ${totalValid + totalInvalid} 个图片文件`);
    console.log(`有效文件: ${totalValid}`);
    console.log(`无效文件: ${totalInvalid}`);
    
    if (totalInvalid === 0) {
        console.log('\n🎉 全部图片修复成功！所有图片文件都有效。');
    } else {
        console.log('\n⚠️  仍有无效图片需要修复。');
    }
}

// 执行验证
main();