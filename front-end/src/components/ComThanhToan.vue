<template>
  <div class="checkout-container">
    <div v-if="loading" class="loading-container">
      <p>Đang xử lý thanh toán...</p>
    </div>
    <div v-else-if="isCheckoutComplete" class="checkout-complete">
      <h2>Cảm ơn bạn đã đặt hàng!</h2>
      <p><strong>Tên người nhận:</strong> {{ recipientName }}</p>
      <p><strong>Số điện thoại:</strong> {{ phoneNumber }}</p>
      <p><strong>Địa chỉ:</strong> {{ address }}</p>
      <p><strong>Phương thức thanh toán:</strong> {{ paymentMethodText }}</p>
      <h3>Sản phẩm bạn đã thanh toán:</h3>
      <ul class="purchased-items">
        <li v-for="item in purchasedItems" :key="item.productId">
          {{ item.name }} - Số lượng: {{ item.quantity }} - Giá:
          {{ formatPrice(item.price * item.quantity) }} VND
        </li>
      </ul>
      <p class="total-amount"><strong>Tổng tiền:</strong> {{ formatPrice(totalAmount) }} VND</p>
      <div class="action-buttons">
        <button class="btn-continue-shopping" @click="continueShopping">
          Tiếp tục mua sắm
        </button>
        <button class="btn-go-home" @click="goHome">Quay lại trang chủ</button>
      </div>
    </div>
    <div v-else class="checkout-form">
      <h2>Thông tin thanh toán</h2>
      <div v-if="cartItems.length === 0" class="empty-cart-message">
        <p>Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.</p>
        <button class="btn-continue-shopping" @click="continueShopping">
          Tiếp tục mua sắm
        </button>
      </div>
      <div v-else>
        <ul class="cart-items">
          <li v-for="item in cartItems" :key="item.productId">
            {{ item.name }} - Số lượng: {{ item.quantity }} - Giá:
            {{ formatPrice(item.price * item.quantity) }} VND
          </li>
        </ul>
        <p class="total-amount"><strong>Tổng tiền:</strong> {{ formatPrice(totalAmount) }} VND</p>
        <form @submit.prevent="submitCheckout">
          <!-- Tên người nhận -->
          <div class="form-group">
            <label for="recipientName">Tên người nhận:</label>
            <input
              type="text"
              id="recipientName"
              v-model="recipientName"
              required
            />
          </div>

          <!-- Số điện thoại -->
          <div class="form-group">
            <label for="phoneNumber">Số điện thoại:</label>
            <input type="tel" id="phoneNumber" v-model="phoneNumber" required />
          </div>

          <!-- Địa chỉ -->
          <div class="form-group">
            <label for="address">Địa chỉ:</label>
            <textarea id="address" v-model="address" rows="3" required></textarea>
          </div>

          <!-- Phương thức thanh toán -->
          <div class="form-group">
            <label for="paymentMethod">Phương thức thanh toán:</label>
            <select id="paymentMethod" v-model="paymentMethod" required>
              <option value="credit_card">Thẻ tín dụng</option>
              <option value="cash_on_delivery">Thanh toán khi nhận hàng</option>
              <option value="bank_transfer">Chuyển khoản ngân hàng</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit">Thanh toán</button>
            <button type="button" class="btn-cancel" @click="goBackToCart">Quay lại giỏ hàng</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      recipientName: "",
      phoneNumber: "",
      address: "",
      paymentMethod: "credit_card",
      isCheckoutComplete: false,
      loading: false,
      cartItems: [],
      totalAmount: 0,
      purchasedItems: [],
      error: null
    };
  },
  created() {
    this.fetchCart();
  },
  computed: {
    paymentMethodText() {
      switch (this.paymentMethod) {
        case "credit_card":
          return "Thẻ tín dụng";
        case "cash_on_delivery":
          return "Thanh toán khi nhận hàng";
        case "bank_transfer":
          return "Chuyển khoản ngân hàng";
        default:
          return "";
      }
    },
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
        
        this.cartItems = response.data.items || [];
        this.totalAmount = response.data.totalAmount || 0;
      } catch (error) {
        console.error('Lỗi khi tải giỏ hàng:', error);
        this.error = 'Không thể tải giỏ hàng. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },
    
    async submitCheckout() {
      if (this.cartItems.length === 0) {
        alert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
        return;
      }
      
      try {
        this.loading = true;
        
        // Lưu thông tin đơn hàng
        const orderData = {
          recipientName: this.recipientName,
          phoneNumber: this.phoneNumber,
          address: this.address,
          paymentMethod: this.paymentMethod,
          items: this.cartItems,
          totalAmount: this.totalAmount,
          orderDate: new Date().toISOString()
        };
        
        // Lấy token xác thực
        const token = localStorage.getItem('token');
        
        // Gửi đơn hàng đến backend thay vì lưu vào localStorage
        await axios.post('http://localhost:3007/api/orders', orderData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Lưu lại các sản phẩm đã mua để hiển thị sau khi thanh toán
        this.purchasedItems = [...this.cartItems];
        
        // Xóa giỏ hàng sau khi thanh toán
        await axios.delete('http://localhost:3007/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        this.isCheckoutComplete = true;
      } catch (error) {
        console.error('Lỗi khi xử lý thanh toán:', error);
        alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.');
      } finally {
        this.loading = false;
      }
    },
    
    saveOrderToHistory(orderData) {
      // Lấy lịch sử đơn hàng từ localStorage
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      
      // Thêm đơn hàng mới vào lịch sử
      orderHistory.push({
        id: Date.now().toString(), // Tạo ID đơn giản dựa trên timestamp
        ...orderData
      });
      
      // Lưu lại vào localStorage
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    },
    
    goBackToCart() {
      this.$router.push("/cart");
    },
    
    goHome() {
      this.$router.push("/");
    },
    
    continueShopping() {
      this.$router.push("/sanpham");
    },
    
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  },
};
</script>

<style scoped>
.checkout-container {
  max-width: 800px;
  margin: 60px auto;
  padding: 90px 40px 40px;
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
}

.checkout-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(90deg, #4a90e2, #9b51e0);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

h2 {
  margin-bottom: 30px;
  color: #2d3748;
  text-align: center;
  font-weight: 700;
  font-size: 1.8rem;
  position: relative;
  padding-bottom: 15px;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #4a90e2, #9b51e0);
  border-radius: 3px;
}

.cart-items,
.purchased-items {
  list-style-type: none;
  padding: 0;
  margin: 25px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.cart-items li,
.purchased-items li {
  margin: 0;
  background-color: #fff;
  padding: 18px 20px;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.cart-items li:last-child,
.purchased-items li:last-child {
  border-bottom: none;
}

.cart-items li:hover,
.purchased-items li:hover {
  background-color: #f7fafc;
  transform: translateX(5px);
}

.cart-items li span,
.purchased-items li span {
  font-weight: 600;
  color: #2d3748;
}

.total-amount {
  text-align: right;
  font-size: 1.3em;
  margin: 20px 0;
  color: #e53e3e;
  font-weight: 700;
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #e53e3e;
}

.form-group {
  margin-bottom: 25px;
  text-align: left;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2d3748;
  font-size: 1.05em;
}

input[type="text"],
input[type="tel"],
textarea,
select {
  width: 100%;
  padding: 14px;
  font-size: 1em;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

input[type="text"]:focus,
input[type="tel"]:focus,
textarea:focus,
select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  outline: none;
}

textarea {
  resize: vertical;
  height: 100px;
}

button {
  display: inline-block;
  padding: 14px 24px;
  font-size: 1.05em;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 30px;
}

.btn-submit {
  width: 100%;
  color: #fff;
  background: linear-gradient(135deg, #4a90e2, #357ab8);
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
}

.btn-submit:hover {
  background: linear-gradient(135deg, #357ab8, #2a6496);
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(74, 144, 226, 0.5);
}

.btn-cancel {
  width: 100%;
  color: #fff;
  background: linear-gradient(135deg, #9b51e0, #7e40b8);
  box-shadow: 0 4px 15px rgba(155, 81, 224, 0.4);
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #7e40b8, #6b35a0);
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(155, 81, 224, 0.5);
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 30px;
}

.btn-continue-shopping {
  background: linear-gradient(135deg, #f2c94c, #e1b347);
  color: #3e3e6d;
  flex: 1;
  box-shadow: 0 4px 15px rgba(242, 201, 76, 0.4);
}

.btn-continue-shopping:hover {
  background: linear-gradient(135deg, #e1b347, #d0a43e);
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(242, 201, 76, 0.5);
}

.btn-go-home {
  background: linear-gradient(135deg, #e57373, #c85b5b);
  color: #fff;
  flex: 1;
  box-shadow: 0 4px 15px rgba(229, 115, 115, 0.4);
}

.btn-go-home:hover {
  background: linear-gradient(135deg, #c85b5b, #b54b4b);
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(229, 115, 115, 0.5);
}

.checkout-complete {
  text-align: left;
  padding: 30px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  position: relative;
  overflow: hidden;
}

.checkout-complete::before {
  content: '✓';
  position: absolute;
  top: -15px;
  right: -15px;
  font-size: 120px;
  color: rgba(72, 187, 120, 0.1);
  font-weight: bold;
  line-height: 1;
}

.checkout-complete h2 {
  color: #48bb78;
  margin-bottom: 25px;
  text-align: center;
}

.checkout-complete h3 {
  color: #2d3748;
  margin-top: 30px;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 1.3rem;
  border-left: 4px solid #4a90e2;
  padding-left: 15px;
}

.checkout-complete p {
  margin: 12px 0;
  padding: 10px;
  background-color: #f7fafc;
  border-radius: 8px;
  font-size: 1.05em;
}

.checkout-complete p strong {
  color: #4a5568;
  margin-right: 5px;
}

.empty-cart-message {
  text-align: center;
  padding: 40px 30px;
  background-color: #fff;
  border-radius: 12px;
  margin: 30px 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px dashed #cbd5e0;
}

.empty-cart-message p {
  font-size: 1.1em;
  color: #4a5568;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .checkout-container {
    padding: 80px 20px 30px;
    margin: 30px 15px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .checkout-complete h3 {
    font-size: 1.2rem;
  }
  
  .total-amount {
    font-size: 1.2em;
  }
  
  button {
    padding: 12px 20px;
    font-size: 1em;
  }
}
</style>
