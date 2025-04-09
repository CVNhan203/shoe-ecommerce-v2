<template>
  <div class="product-item">
    <router-link :to="'/product/' + product._id" class="product-link">
      <div class="image-container">
        <img :src="product.image" alt="Product Image" class="product-image" />
      </div>
      <h3 class="product-name">{{ product.name }}</h3>
    </router-link>
    <p class="price">{{ formatPrice(product.price) }} ₫</p>
    <p class="stock-info" :class="{ 'out-of-stock': product.stock <= 0, 'low-stock': product.stock > 0 && product.stock < 5 }">
      {{ product.stock > 0 ? `Còn lại: ${product.stock}` : 'Hết hàng' }}
    </p>

    <div class="button-group">
      <button 
        class="btn btn-primary" 
        @click="addToCart(product)"
        :disabled="product.stock <= 0"
      >
        {{ product.stock > 0 ? 'Mua' : 'Hết hàng' }}
      </button>
      <router-link :to="'/product/' + product._id" class="btn btn-secondary">Chi Tiết</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  
  methods: {
    async addToCart(product) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          // Hiển thị thông báo và chuyển hướng đến trang đăng nhập
          if (confirm('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Đăng nhập ngay?')) {
            this.$router.push('/login');
          }
          return;
        }
        
        if (product.stock <= 0) {
          alert('Sản phẩm đã hết hàng!');
          return;
        }
        
        await axios.post('http://localhost:3007/api/cart', {
          productId: product._id,
          quantity: 1
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
      } catch (error) {
        console.error('Error adding to cart:', error);
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message || 'Không thể thêm sản phẩm. Sản phẩm có thể đã hết hàng.');
        } else {
          alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng đăng nhập rồi quay lại.');
        }
      }
    },
    
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }
}
</script>

<style scoped>
.product-item {
  position: relative;
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.image-container {
  position: relative;
  width: 100%;
  padding-top: 100%;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 8px;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-item:hover .product-image {
  transform: scale(1.05);
}

.product-name {
  font-size: 1em;
  font-weight: 600;
  color: #333;
  margin: 8px 0;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price {
  font-size: 1.1em;
  font-weight: 700;
  color: #e53935;
  margin: 8px 0;
}

.stock-info {
  font-size: 0.85em;
  font-weight: 500;
  margin: 5px 0;
  color: #2f855a;
}

.out-of-stock {
  color: #e53e3e;
}

.low-stock {
  color: #dd6b20;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background-color: #000000;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #333;
}

.btn-secondary {
  background-color: #dc2626;
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background-color: #b91c1c;
}

.btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  color: #6b7280;
}

@media (max-width: 768px) {
  .product-item {
    padding: 12px;
  }

  .product-name {
    font-size: 0.9em;
    height: 2.5em;
  }

  .price {
    font-size: 1em;
  }

  .btn {
    padding: 6px 10px;
    font-size: 0.8em;
  }
}
</style>

