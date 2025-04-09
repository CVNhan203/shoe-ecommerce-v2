<template>
  <div class="product-detail-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải thông tin sản phẩm...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="$router.push('/sanpham')" class="back-button">Quay lại danh sách sản phẩm</button>
    </div>
    
    <!-- Product detail -->
    <div v-else-if="product" class="product-detail">
      <div class="product-image-container">
        <img :src="product.image" :alt="product.name" class="product-image" />
      </div>
      
      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-price">{{ formatPrice(product.price) }} đ</p>
        <p class="product-stock">Còn lại: {{ product.stock }} sản phẩm</p>
        
        <div class="quantity-control">
          <button @click="decreaseQuantity" class="quantity-btn" :disabled="quantity <= 1">-</button>
          <span class="quantity">{{ quantity }}</span>
          <button @click="increaseQuantity" class="quantity-btn" :disabled="quantity >= product.stock">+</button>
        </div>
        
        <div v-if="product.stock <= 0" class="stock-warning">
          Sản phẩm đã hết hàng!
        </div>
        
        <div class="action-buttons">
          <button 
            @click="addToCart" 
            class="add-to-cart-btn"
            :disabled="product.stock <= 0"
          >
            {{ product.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng' }}
          </button>
          <button @click="$router.push('/sanpham')" class="continue-shopping-btn">Tiếp tục mua sắm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      product: null,
      quantity: 1,
      loading: true,
      error: null
    };
  },
  
  created() {
    this.fetchProductDetail();
  },
  
  methods: {
    async fetchProductDetail() {
      try {
        this.loading = true;
        const productId = this.$route.params.id;
        const response = await axios.get(`http://localhost:3007/api/products/${productId}`);
        this.product = response.data;
        
        // Đảm bảo số lượng không vượt quá tồn kho
        if (this.quantity > this.product.stock) {
          this.quantity = this.product.stock;
        }
        
        this.loading = false;
      } catch (error) {
        console.error('Error fetching product details:', error);
        this.error = "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.";
        this.loading = false;
      }
    },
    
    increaseQuantity() {
      if (this.quantity < this.product.stock) {
        this.quantity++;
      }
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    
    async addToCart() {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
          this.$router.push(`/login?redirect=product/${this.product._id}`);
          return;
        }

        if (this.product.stock <= 0) {
          alert('Sản phẩm đã hết hàng!');
          return;
        }

        if (this.quantity > this.product.stock) {
          alert(`Chỉ còn ${this.product.stock} sản phẩm trong kho.`);
          this.quantity = this.product.stock;
          return;
        }
        
        await axios.post('http://localhost:3007/api/cart', {
          productId: this.product._id,
          quantity: this.quantity
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        alert(`Đã thêm ${this.quantity} sản phẩm vào giỏ hàng!`);
        
        // Cập nhật lại thông tin sản phẩm sau khi thêm vào giỏ
        await this.fetchProductDetail();
      } catch (error) {
        console.error('Error adding to cart:', error);
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message || 'Không thể thêm sản phẩm. Sản phẩm có thể đã hết hàng.');
        } else {
          alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
        }
      }
    },
    
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }
};
</script>

<style scoped>
.product-detail-container {
  padding: 90px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
}

.product-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 40px;
  transition: all 0.3s ease;
}

.product-image-container {
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.product-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.02);
}

.product-info {
  flex: 1;
  min-width: 300px;
  padding: 20px;
}

.product-name {
  font-size: 32px;
  margin-bottom: 20px;
  color: #2d3748;
  font-weight: 600;
  line-height: 1.3;
}

.product-description {
  font-size: 16px;
  color: #4a5568;
  margin-bottom: 25px;
  line-height: 1.8;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf2f7;
}

.product-price {
  font-size: 28px;
  font-weight: 700;
  color: #e53e3e;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-stock {
  font-size: 16px;
  color: #4a5568;
  margin-bottom: 20px;
  padding: 10px 15px;
  background: #f7fafc;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid #e2e8f0;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  background: #f7fafc;
  padding: 10px;
  border-radius: 8px;
  width: fit-content;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  background-color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #edf2f7;
  color: #2d3748;
}

.quantity {
  width: 60px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: #2d3748;
  margin: 0 10px;
}

.stock-warning {
  color: #e53e3e;
  font-size: 14px;
  margin-top: 10px;
  padding: 8px 12px;
  background: #fff5f5;
  border-radius: 6px;
  border: 1px solid #fed7d7;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.add-to-cart-btn, .continue-shopping-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-to-cart-btn {
  background: linear-gradient(145deg, #000000, #1a1a1a);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.add-to-cart-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.continue-shopping-btn {
  background: linear-gradient(145deg, #c53030, #9b2c2c);
  color: white;
  box-shadow: 0 4px 6px rgba(197, 48, 48, 0.1);
}

.continue-shopping-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(197, 48, 48, 0.15);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product-detail {
    padding: 20px;
    gap: 20px;
  }

  .product-name {
    font-size: 24px;
  }

  .product-price {
    font-size: 24px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .add-to-cart-btn, .continue-shopping-btn {
    padding: 12px 20px;
  }
}
</style>


