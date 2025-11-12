// 商品详情页原生JavaScript功能实现

// 当前商品信息
let currentProduct = {
    id: 1,
    name: '默认商品',
    description: '默认商品描述',
    price: 0,
    image: './images/初音未来.jpg',
    category: 'default',
    index: 0
};

// 从URL参数加载商品信息
function loadProductFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 如果URL中有参数，则更新当前商品信息
    if (urlParams.has('id')) {
        currentProduct.id = parseInt(urlParams.get('id')) || currentProduct.id;
    }
    
    if (urlParams.has('name')) {
        currentProduct.name = urlParams.get('name') || currentProduct.name;
    }
    
    if (urlParams.has('description')) {
        currentProduct.description = urlParams.get('description') || currentProduct.description;
    }
    
    if (urlParams.has('price')) {
        currentProduct.price = parseFloat(urlParams.get('price')) || currentProduct.price;
    }
    
    if (urlParams.has('image')) {
        currentProduct.image = urlParams.get('image') || currentProduct.image;
    }
    
    if (urlParams.has('category')) {
        currentProduct.category = urlParams.get('category') || currentProduct.category;
    }
    
    if (urlParams.has('index')) {
        currentProduct.index = parseInt(urlParams.get('index')) || currentProduct.index;
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 从URL参数获取商品信息
    loadProductFromUrlParams();
    
    // 初始化页面功能
    initializePage();
});

// 初始化页面功能
function initializePage() {
    // 绑定各种事件监听器
    bindEventListeners();
    
    // 更新页面商品信息
    updateProductInfo();
    
    // 初始化购物车数量显示
    updateCartCountDisplay();
    
    // 初始化倒计时
    initializeCountdown();
}

// 更新页面商品信息
function updateProductInfo() {
    // 更新页面标题
    document.title = currentProduct.name + " - 商品详情";
    
    // 更新商品名称
    const productNameElement = document.getElementById('product-name');
    if (productNameElement) {
        productNameElement.textContent = currentProduct.name;
    }
    
    // 更新商品描述
    const productDescriptionElement = document.getElementById('product-description');
    if (productDescriptionElement) {
        productDescriptionElement.textContent = currentProduct.description;
    }
    
    // 更新商品详细描述
    const productDetailDescriptionElement = document.getElementById('product-detail-description');
    if (productDetailDescriptionElement) {
        productDetailDescriptionElement.textContent = currentProduct.description + " 这是一款高品质的商品，具有精美的设计和优良的品质，能够满足您的各种需求。";
    }
    
    // 更新商品价格
    const currentPriceElement = document.getElementById('current-price');
    if (currentPriceElement) {
        currentPriceElement.textContent = '¥' + currentProduct.price;
    }
    
    // 更新原价（原价为现价的1.2倍）
    const originalPriceElement = document.getElementById('original-price');
    if (originalPriceElement) {
        originalPriceElement.textContent = '¥' + (currentProduct.price * 1.2).toFixed(0);
    }
    
    // 更新折扣标签
    const discountTagElement = document.getElementById('discount-tag');
    if (discountTagElement) {
        const discount = Math.round((1 - currentProduct.price / (currentProduct.price * 1.2)) * 100);
        discountTagElement.textContent = discount + '折';
    }
    
    // 更新商品图片
    const mainImageElement = document.getElementById('main-image');
    if (mainImageElement) {
        // 如果图片路径已经是完整路径，则直接使用；否则添加商城首页路径前缀
        if (currentProduct.image.startsWith('images/')) {
            // 检查图片文件是否存在，如果不存在则使用默认图片
            const imagePath = '../商城首页/' + currentProduct.image;
            // 将不存在的图片文件映射到实际存在的文件
            const imageMap = {
                '../商城首页/images/新品预售A.jpg': '../商城首页/images/阿萨玩偶.jpg',
                '../商城首页/images/新品预售B.jpg': '../商城首页/images/阿梓玩偶.jpg',
                '../商城首页/images/手办模型A.jpg': '../商城首页/images/手办模型A.jpg',
                '../商城首页/images/手办模型B.jpg': '../商城首页/images/手办模型B.jpg',
                '../商城首页/images/手办模型C.jpg': '../商城首页/images/七海模型.jpg',
                '../商城首页/images/手办模型D.jpg': '../商城首页/images/初音模型.jpg',
                '../商城首页/images/动漫周边A.jpg': '../商城首页/images/七海阿萨.jpg',
                '../商城首页/images/动漫周边B.jpg': '../商城首页/images/阿梓.png',
                '../商城首页/images/动漫周边C.jpg': '../商城首页/images/贝梓.jpg',
                '../商城首页/images/动漫周边D.jpg': '../商城首页/images/初音未来.jpg',
                '../商城首页/images/虚拟偶像A.jpg': '../商城首页/images/b站.jpg',
                '../商城首页/images/虚拟偶像B.jpg': '../商城首页/images/千舰纪念卡.jpeg',
                '../商城首页/images/虚拟偶像C.jpg': '../商城首页/images/主题插画卡.jpeg',
                '../商城首页/images/虚拟偶像D.jpg': '../商城首页/images/生日贺卡.jpeg',
                '../商城首页/images/漫展票务A.jpg': '../商城首页/images/北京·IDO动漫游戏嘉年华52nd.png',
                '../商城首页/images/漫展票务B.jpg': '../商城首页/images/北京·第26届IJOY国际动漫游戏狂欢节.png',
                '../商城首页/images/漫展票务C.jpg': '../商城首页/images/南京第四届超电国漫嘉年华.png',
                '../商城首页/images/漫展票务D.jpg': '../商城首页/images/广西·ACNC首届昭平动漫嘉年华.png'
            };
            
            mainImageElement.src = imageMap[imagePath] || imagePath;
        } else {
            mainImageElement.src = currentProduct.image;
        }
        mainImageElement.alt = currentProduct.name;
    }
    
    
}

// 绑定事件监听器
function bindEventListeners() {
    // 收藏按钮事件
    const favoriteBtn = document.getElementById('favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', toggleFavorite);
    }
    
    // 数量增减按钮事件
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', decreaseQuantity);
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', increaseQuantity);
    }
    
    // 加入购物车按钮事件
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }
    
    // 立即购买按钮事件
    const buyNowBtn = document.getElementById('buy-now');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', buyNow);
    }
    
    
}

// 切换收藏状态
function toggleFavorite() {
    const favoriteBtn = document.getElementById('favorite-btn');
    const heartIcon = favoriteBtn.querySelector('i');
    
    if (heartIcon.classList.contains('text-gray-400')) {
        // 未收藏状态，设置为已收藏
        heartIcon.classList.remove('text-gray-400');
        heartIcon.classList.add('text-pink-500');
        showMessage('已添加到收藏夹');
    } else {
        // 已收藏状态，设置为未收藏
        heartIcon.classList.remove('text-pink-500');
        heartIcon.classList.add('text-gray-400');
        showMessage('已从收藏夹移除');
    }
}

// 减少数量
function decreaseQuantity() {
    const quantityDisplay = document.getElementById('quantity-display');
    let quantity = parseInt(quantityDisplay.textContent);
    
    if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
    }
}

// 增加数量
function increaseQuantity() {
    const quantityDisplay = document.getElementById('quantity-display');
    let quantity = parseInt(quantityDisplay.textContent);
    
    quantity++;
    quantityDisplay.textContent = quantity;
}



// 更新购物车数量显示
function updateCartCountDisplay() {
    try {
        // 从本地存储获取购物车数据
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
        
        // 更新页面上的购物车数量显示
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalQuantity;
        }
        
        // 更新所有页面的购物车数量显示
        const cartCountElements = document.querySelectorAll('#cart-count, .cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalQuantity;
        });
        
        // 保存购物车总数量到本地存储
        localStorage.setItem('cartCount', totalQuantity.toString());
    } catch (error) {
        console.error('更新购物车数量显示失败:', error);
        // 出错时显示0
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = '0';
        }
        
        const cartCountElements = document.querySelectorAll('#cart-count, .cart-count');
        cartCountElements.forEach(element => {
            element.textContent = '0';
        });
    }
}

// 添加到购物车
function addToCart() {
    // 获取当前数量
    const quantityDisplay = document.getElementById('quantity-display');
    const quantity = parseInt(quantityDisplay.textContent);
    
    try {
        // 保存商品到本地存储（模拟购物车）
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        // 使用商品ID作为唯一标识（与商城首页保持一致）
        const existingItemIndex = cartItems.findIndex(item => item.id === currentProduct.id);
        
        // 处理图片路径
        let productImage = currentProduct.image;
        if (currentProduct.image.startsWith('images/')) {
            // 检查图片文件是否存在，如果不存在则使用默认图片
            const imagePath = '../商城首页/' + currentProduct.image;
            // 将不存在的图片文件映射到实际存在的文件
            const imageMap = {
                '../商城首页/images/新品预售A.jpg': '../商城首页/images/阿萨玩偶.jpg',
                '../商城首页/images/新品预售B.jpg': '../商城首页/images/阿梓玩偶.jpg',
                '../商城首页/images/手办模型A.jpg': '../商城首页/images/手办模型A.jpg',
                '../商城首页/images/手办模型B.jpg': '../商城首页/images/手办模型B.jpg',
                '../商城首页/images/手办模型C.jpg': '../商城首页/images/七海模型.jpg',
                '../商城首页/images/手办模型D.jpg': '../商城首页/images/初音模型.jpg',
                '../商城首页/images/动漫周边A.jpg': '../商城首页/images/七海阿萨.jpg',
                '../商城首页/images/动漫周边B.jpg': '../商城首页/images/阿梓.png',
                '../商城首页/images/动漫周边C.jpg': '../商城首页/images/贝梓.jpg',
                '../商城首页/images/动漫周边D.jpg': '../商城首页/images/初音未来.jpg',
                '../商城首页/images/虚拟偶像A.jpg': '../商城首页/images/b站.jpg',
                '../商城首页/images/虚拟偶像B.jpg': '../商城首页/images/千舰纪念卡.jpeg',
                '../商城首页/images/虚拟偶像C.jpg': '../商城首页/images/主题插画卡.jpeg',
                '../商城首页/images/虚拟偶像D.jpg': '../商城首页/images/生日贺卡.jpeg',
                '../商城首页/images/漫展票务A.jpg': '../商城首页/images/北京·IDO动漫游戏嘉年华52nd.png',
                '../商城首页/images/漫展票务B.jpg': '../商城首页/images/北京·第26届IJOY国际动漫游戏狂欢节.png',
                '../商城首页/images/漫展票务C.jpg': '../商城首页/images/南京第四届超电国漫嘉年华.png',
                '../商城首页/images/漫展票务D.jpg': '../商城首页/images/广西·ACNC首届昭平动漫嘉年华.png'
            };
            
            productImage = imageMap[imagePath] || imagePath;
        }
        
        if (existingItemIndex >= 0) {
            // 如果商品已存在，增加数量
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            // 如果商品不存在，添加新商品
            cartItems.push({
                id: currentProduct.id,
                name: currentProduct.name,
                description: currentProduct.description,
                price: currentProduct.price,
                image: productImage,
                quantity: quantity
            });
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // 计算购物车总数量
        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        // 更新页面上的购物车数量显示
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalQuantity;
        }
        
        // 更新所有页面的购物车数量显示
        const cartCountElements = document.querySelectorAll('#cart-count, .cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalQuantity;
        });
        
        // 保存购物车总数量到本地存储
        localStorage.setItem('cartCount', totalQuantity.toString());
        
        // 显示提示
        const cartToast = document.getElementById('cart-toast');
        if (cartToast) {
            cartToast.classList.remove('opacity-0');
            cartToast.classList.add('opacity-100');
            
            // 3秒后隐藏提示
            setTimeout(() => {
                cartToast.classList.remove('opacity-100');
                cartToast.classList.add('opacity-0');
            }, 3000);
        }
        
        console.log(`已将 ${currentProduct.name} 添加到购物车！数量：${quantity}`);
        updateCartCountDisplay();
        
        // 触发storage事件，通知其他页面更新
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'cartItems',
            newValue: JSON.stringify(cartItems)
        }));
    } catch (error) {
        console.error('添加商品到购物车失败:', error);
        // 显示错误提示
        const cartToast = document.getElementById('cart-toast');
        if (cartToast) {
            cartToast.innerHTML = '<div class="flex items-center"><i class="fa fa-exclamation-circle mr-2"></i><span>添加失败，请重试</span></div>';
            cartToast.classList.remove('opacity-0');
            cartToast.classList.add('opacity-100');
            
            // 3秒后隐藏提示
            setTimeout(() => {
                cartToast.classList.remove('opacity-100');
                cartToast.classList.add('opacity-0');
            }, 3000);
        }
    }
}

// 立即购买
function buyNow() {
    // 先将商品添加到购物车
    addToCart();
    
    // 跳转到结算页面
    window.location.href = '../结算页面/index.html';
}

// 初始化倒计时
function initializeCountdown() {
    // 设置倒计时结束时间（当前时间+2小时）
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 2);
    
    // 更新倒计时函数
    function updateCountdown() {
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) {
            // 倒计时结束
            document.getElementById('countdown').textContent = '00:00:00';
            return;
        }
        
        // 计算小时、分钟、秒
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 格式化时间显示
        const formattedTime = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
        
        document.getElementById('countdown').textContent = formattedTime;
    }
    
    // 立即执行一次更新
    updateCountdown();
    
    // 每秒更新一次倒计时
    setInterval(updateCountdown, 1000);
}

// 显示消息提示
function showMessage(text) {
    // 检查是否已存在消息元素
    let messageElement = document.getElementById('interactive-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'interactive-message';
        messageElement.style.position = 'fixed';
        messageElement.style.top = '20px';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translateX(-50%)';
        messageElement.style.backgroundColor = 'rgba(251, 114, 153, 0.9)';
        messageElement.style.color = 'white';
        messageElement.style.padding = '10px 20px';
        messageElement.style.borderRadius = '20px';
        messageElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        messageElement.style.zIndex = '10000';
        messageElement.style.opacity = '0';
        messageElement.style.transition = 'opacity 0.3s ease';
        messageElement.style.fontSize = '14px';
        messageElement.style.fontWeight = 'bold';
        document.body.appendChild(messageElement);
    }
    
    messageElement.textContent = text;
    messageElement.style.opacity = '1';
    
    // 3秒后淡出
    setTimeout(() => {
        messageElement.style.opacity = '0';
        // 0.3秒后完全隐藏
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 3000);
}

// 返回上一页
function goBack() {
    window.history.back();
}

// 注意：以下配置仅用于开发环境，在生产环境中应移除
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#FF4D6D',
          secondary: '#FFB6C1',
          accent: '#FF9EBB',
          light: '#FFF0F3',
          dark: '#4A4A4A',
          'primary-dark': '#D63355',
          'bg-light': '#F9F9F9',
          'border-light': '#EEEEEE'
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        boxShadow: {
          'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
          'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
          'hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'bounce-slow': 'bounce 2s infinite',
        }
      }
    }
  }
}