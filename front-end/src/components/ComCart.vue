<template>
   <!-- Hiển thị loading state -->
  <div v-if="loading" class="loading-container">
    <div class="spinner"></div>
    <p>Đang tải giỏ hàng...</p>
  </div>
  
  <!-- Hiển thị khi giỏ hàng trống -->
  <div v-else-if="!cart || cart.items.length === 0" class="empty-cart">
    <img src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png" alt="Empty Cart" class="empty-cart-image" />
    <p class="empty-cart-text">Giỏ hàng của bạn còn trống</p>
    <button class="empty-cart-btn" @click="$router.push('/sanpham')">MUA NGAY</button>
  </div>
  
  <!-- Hiển thị giỏ hàng khi có sản phẩm -->
  <div v-else class="modal-content">
    <h1>Giỏ Hàng</h1>
    <table class="table" style="width: 100%;">
      <thead>
        <tr>
          <th>Hình</th>
          <th>Sản phẩm</th>
          <th>Đơn giá</th>
          <th>Số lượng</th>
          <th>Tiền</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <!-- Dùng v-for thể hiện giỏ hàng -->
        <tr v-for="item in cart.items" :key="item.productId">
          <td><img :src="item.image" style="width: 100px; height: 100px;"></td>
          <td class="align-middle">{{ item.name }}</td>
          <td class="align-middle">{{ formatPrice(item.price) }} đ</td>
          <!-- Nút giảm -->
          <td class="align-middle quantity-cell">
            <div class="quantity-controls">
              <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
              <span class="quantity-value">{{item.quantity}}</span>
              <!-- Nút tăng -->
              <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
            </div>
            <div v-if="item.stockWarning" class="stock-warning">
              Chỉ còn {{item.availableStock}} sản phẩm
            </div>
          </td>
          <td class="align-middle">{{ formatPrice(item.price * item.quantity) }} đ</td>
          <td class="align-middle">
            <button class="btn btn-danger" @click="deleteItem(item)">Xóa</button>
          </td>
        </tr>

        <tr class="summary-row">
          <td colspan="3" class="text-right">Tổng Tiền:</td>
          <td colspan="1" class="total-amount">{{ formatPrice(cart.totalAmount) }} đ</td>
          <td colspan="2" class="action-buttons">
            <button class="btn btn-clear" @click="deleteAll()">Xóa Giỏ Hàng</button>
            <button class="btn btn-checkout" @click="goToPays()">Thanh Toán</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cart: { items: [], totalAmount: 0 },
      loading: true,
      error: null,
      productStocks: {} // Lưu trữ thông tin tồn kho của sản phẩm
    };
  },
  
  created() {
    this.fetchCart();
  },
  
  methods: {
    async fetchCart() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        const response = await axios.get('http://localhost:3007/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        this.cart = response.data;
        
        // Lấy thông tin tồn kho cho mỗi sản phẩm trong giỏ hàng
        await this.fetchProductStocks();
        
        this.loading = false;
      } catch (error) {
        console.error('Error fetching cart:', error);
        this.error = 'Không thể tải giỏ hàng. Vui lòng thử lại sau.';
        this.loading = false;
      }
    },
    
    async fetchProductStocks() {
      try {
        const token = localStorage.getItem('token');
        
        if (!token || !this.cart || !this.cart.items || this.cart.items.length === 0) {
          return;
        }
        
        // Lấy thông tin tồn kho cho từng sản phẩm
        for (const item of this.cart.items) {
          const response = await axios.get(`http://localhost:3007/api/products/${item.productId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Lưu thông tin tồn kho
          this.productStocks[item.productId] = response.data.stock || 0;
          
          // Thêm thông tin cảnh báo tồn kho vào item
          item.availableStock = response.data.stock || 0;
          item.stockWarning = item.quantity >= item.availableStock;
        }
      } catch (error) {
        console.error('Error fetching product stocks:', error);
      }
    },
    
    async increaseQuantity(item) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        // Kiểm tra tồn kho trước khi tăng số lượng
        const availableStock = this.productStocks[item.productId] || 0;
        
        if (item.quantity >= availableStock) {
          alert(`Không thể tăng số lượng. Chỉ còn ${availableStock} sản phẩm trong kho.`);
          return;
        }
        
        // Cập nhật số lượng
        const updatedQuantity = item.quantity + 1;
        
        await axios.put('http://localhost:3007/api/cart', {
          productId: item.productId,
          quantity: updatedQuantity
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Refresh cart
        this.fetchCart();
      } catch (error) {
        console.error('Error updating cart:', error);
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message || 'Không thể tăng số lượng. Sản phẩm có thể đã hết hàng.');
        } else {
          alert('Không thể cập nhật giỏ hàng. Vui lòng thử lại sau.');
        }
      }
    },
    
    async decreaseQuantity(item) {
      if (item.quantity <= 1) {
        this.deleteItem(item);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        // Cập nhật số lượng
        const updatedQuantity = item.quantity - 1;
        
        await axios.put('http://localhost:3007/api/cart', {
          productId: item.productId,
          quantity: updatedQuantity
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Refresh cart
        this.fetchCart();
      } catch (error) {
        console.error('Error updating cart:', error);
        alert('Không thể cập nhật giỏ hàng. Vui lòng thử lại sau.');
      }
    },
    
    async deleteItem(item) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        await axios.delete(`http://localhost:3007/api/cart/${item.productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Refresh cart
        this.fetchCart();
      } catch (error) {
        console.error('Error removing item from cart:', error);
        alert('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      }
    },
    
    async deleteAll() {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        await axios.delete('http://localhost:3007/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Refresh cart
        this.fetchCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Không thể xóa giỏ hàng. Vui lòng thử lại sau.');
      }
    },
    
    goToPays() {
      if (!this.cart || this.cart.items.length === 0) {
        alert("Giỏ hàng của bạn trống, vui lòng thêm sản phẩm trước khi thanh toán.");
        return;
      }
      
      // Kiểm tra tồn kho trước khi thanh toán
      const invalidItems = this.cart.items.filter(item => 
        item.quantity > (this.productStocks[item.productId] || 0)
      );
      
      if (invalidItems.length > 0) {
        const itemNames = invalidItems.map(item => item.name).join(', ');
        alert(`Không thể thanh toán. Số lượng sản phẩm "${itemNames}" vượt quá tồn kho hiện có.`);
        return;
      }
      
      this.$router.push({ 
        name: 'ThanhToan', 
        query: { total: this.cart.totalAmount } 
      });
    },
    
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }
};
</script>

<style scoped>
.modal-content {
    width: 100%;
    max-width: 1200px;
    margin: 100px auto 40px; /* Tăng margin-top để tránh header */
    padding: 40px;
    background: linear-gradient(145deg, #ffffff, #f5f5f5);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
}

.empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 80px); /* Điều chỉnh chiều cao để tránh header */
    padding: 100px 20px 40px; /* Thêm padding-top */
    background: linear-gradient(145deg, #ffffff, #f5f5f5);
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 80px); /* Điều chỉnh chiều cao để tránh header */
    padding-top: 80px; /* Thêm padding-top */
}

.modal-content h1 {
    font-size: 2.5em;
    color: #333;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    background: white;
    border-radius: 12px;
    overflow: hidden;
}

.table thead {
    background: #000;
    color: white;
}

.table th {
    padding: 20px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.9em;
    letter-spacing: 1px;
}

.table td {
    padding: 15px 20px;
    vertical-align: middle;
    border-bottom: 1px solid #eee;
}

.table tbody tr:last-child td {
    border-bottom: none;
}

.table img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Nút tăng giảm số lượng */
.quantity-cell {
    position: relative;
}

.quantity-controls {
    display: flex;
    align-items: center;
    justify-content: center;
}

.quantity-btn {
    width: 36px;
    height: 36px;
    padding: 0;
    margin: 0 8px;
    border: none;
    background: #f0f0f0;
    color: #333;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    font-weight: bold;
}

.quantity-btn:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
}

.quantity-value {
    font-size: 1.1em;
    font-weight: 600;
    min-width: 30px;
    text-align: center;
}

.stock-warning {
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff3cd;
    color: #856404;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Nút xóa sản phẩm */
.btn-danger {
    background: #ff4444;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-danger:hover {
    background: #cc0000;
    transform: translateY(-2px);
}

/* Hàng tổng kết */
.summary-row {
    background-color: #f8f9fa;
    font-weight: bold;
}

.text-right {
    text-align: right;
    font-size: 1.2em;
    padding-right: 20px !important;
}

.total-amount {
    font-size: 1.3em;
    color: #ff4444;
    text-align: center;
    font-weight: 700;
}

.action-buttons {
    display: flex;
    justify-content: space-around;
    gap: 10px;
}

.btn-clear {
    background: #6c757d;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.btn-clear:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-checkout {
    background: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.btn-checkout:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Empty cart styles */
.empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    background: linear-gradient(145deg, #ffffff, #f5f5f5);
    padding: 40px;
}

.empty-cart-image {
    width: 200px;
    height: auto;
    margin-bottom: 30px;
    opacity: 0.8;
}

.empty-cart-text {
    font-size: 1.5em;
    color: #666;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 500;
}

.empty-cart-btn {
    padding: 15px 40px;
    background: #000;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.empty-cart-btn:hover {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Loading styles */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
    .modal-content {
        margin: 80px 10px 20px; /* Điều chỉnh margin cho mobile */
        padding: 20px;
    }

    .table th, .table td {
        padding: 10px;
        font-size: 0.9em;
    }

    .quantity-btn {
        width: 30px;
        height: 30px;
        margin: 0 5px;
    }

    .action-buttons {
        flex-direction: column;
    }

    .btn-clear, .btn-checkout {
        width: 100%;
        margin-bottom: 5px;
    }

    .empty-cart {
        padding: 80px 20px 40px; /* Điều chỉnh padding cho mobile */
    }
}

/* Thêm hiệu ứng hover cho hàng sản phẩm */
.table tbody tr:not(.summary-row):hover {
    background-color: #f8f9fa;
    transition: background-color 0.3s ease;
}

/* Làm nổi bật giá tiền */
.align-middle:nth-child(3),
.align-middle:nth-child(5) {
    font-weight: 600;
    color: #333;
}
</style>

