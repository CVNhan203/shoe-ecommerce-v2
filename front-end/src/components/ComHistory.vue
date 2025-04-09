<template>
  <div class="history-container">
    <h2 class="history-title">Lịch Sử Đơn Hàng</h2>
    
    <div v-if="loading" class="loading-container">
      <p>Đang tải lịch sử đơn hàng...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button class="btn-retry" @click="loadOrderHistory">Thử lại</button>
    </div>
    
    <div v-else-if="orderHistory.length === 0" class="empty-history">
      <div class="empty-icon">📋</div>
      <p>Bạn chưa có đơn hàng nào</p>
      <button class="btn-shop-now" @click="goToShop">Mua sắm ngay</button>
    </div>
    
    <div v-else class="order-list">
      <div v-for="order in orderHistory" :key="order._id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <span class="order-id">Mã đơn hàng: #{{ getOrderId(order) }}</span>
            <span class="order-date">{{ formatDate(order.orderDate) }}</span>
          </div>
          <div class="order-status" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </div>
        </div>
        
        <div class="order-details">
          <div class="recipient-info">
            <h4>Thông tin người nhận</h4>
            <p><strong>Tên:</strong> {{ order.recipientName }}</p>
            <p><strong>Số điện thoại:</strong> {{ order.phoneNumber }}</p>
            <p><strong>Địa chỉ:</strong> {{ order.address }}</p>
            <p><strong>Phương thức thanh toán:</strong> {{ getPaymentMethodText(order.paymentMethod) }}</p>
          </div>
          
          <div class="order-items">
            <h4>Sản phẩm đã mua</h4>
            <ul>
              <li v-for="item in order.items" :key="item.productId" class="order-item">
                <div class="item-info">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-quantity">x{{ item.quantity }}</span>
                </div>
                <span class="item-price">{{ formatPrice(item.price * item.quantity) }} VND</span>
              </li>
            </ul>
            <div class="order-total">
              <span>Tổng tiền:</span>
              <span class="total-amount">{{ formatPrice(order.totalAmount) }} VND</span>
            </div>
          </div>
        </div>
        
        <div v-if="canCancelOrder(order)" class="order-actions">
          <button class="btn-cancel-order" @click="cancelOrder(order._id)">Hủy đơn hàng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ComHistory',
  data() {
    return {
      orderHistory: [],
      loading: true,
      error: null
    };
  },
  created() {
    this.loadOrderHistory();
  },
  methods: {
    async loadOrderHistory() {
      try {
        this.loading = true;
        this.error = null;
        
        // Kiểm tra xem người dùng đã đăng nhập chưa
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        
        // Lấy lịch sử đơn hàng từ backend
        // Backend đã tự động lọc theo userId từ token
        const response = await axios.get('http://localhost:3007/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        this.orderHistory = response.data;
      } catch (error) {
        console.error('Lỗi khi tải lịch sử đơn hàng:', error);
        this.error = 'Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },
    
    getOrderId(order) {
      if (!order || !order._id) return 'N/A';
      return order._id.substring(0, 8);
    },
    
    getStatusText(status) {
      switch(status) {
        case 'pending': return 'Chờ xử lý';
        case 'processing': return 'Đang xử lý';
        case 'shipped': return 'Đang giao hàng';
        case 'delivered': return 'Đã giao hàng';
        case 'cancelled': return 'Đã hủy';
        default: return 'Đã thanh toán';
      }
    },
    
    getStatusClass(status) {
      switch(status) {
        case 'pending': return 'pending';
        case 'processing': return 'processing';
        case 'shipped': return 'shipped';
        case 'delivered': return 'success';
        case 'cancelled': return 'cancelled';
        default: return 'success';
      }
    },
    
    canCancelOrder(order) {
      // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc processing
      return order.status === 'pending' || order.status === 'processing';
    },
    
    async cancelOrder(orderId) {
      try {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
          return;
        }
        
        this.loading = true;
        const token = localStorage.getItem('token');
        
        await axios.put(`http://localhost:3007/api/orders/${orderId}/cancel`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Tải lại danh sách đơn hàng
        await this.loadOrderHistory();
        
        alert('Đơn hàng đã được hủy thành công!');
      } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error);
        alert('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
      } finally {
        this.loading = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    },
    
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    
    getPaymentMethodText(method) {
      switch (method) {
        case "credit_card":
          return "Thẻ tín dụng";
        case "cash_on_delivery":
          return "Thanh toán khi nhận hàng";
        case "bank_transfer":
          return "Chuyển khoản ngân hàng";
        default:
          return method;
      }
    },
    
    goToShop() {
      this.$router.push('/sanpham');
    }
  }
};
</script>

<style scoped>
.history-container {
  max-width: 1000px;
  margin: 60px auto;
  padding: 90px 30px 40px;
  font-family: 'Poppins', sans-serif;
}

.history-title {
  text-align: center;
  margin-bottom: 40px;
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 15px;
}

.history-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #4a90e2, #9b51e0);
  border-radius: 3px;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.1em;
  color: #4a5568;
  gap: 20px;
}

.btn-retry {
  background: #4a5568;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  color: #cbd5e0;
}

.empty-history p {
  font-size: 1.2em;
  color: #4a5568;
  margin-bottom: 30px;
}

.btn-shop-now {
  background: linear-gradient(135deg, #4a90e2, #357ab8);
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
}

.btn-shop-now:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(74, 144, 226, 0.5);
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.order-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  border-bottom: 1px solid #edf2f7;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-id {
  font-weight: 700;
  font-size: 1.1em;
  color: #2d3748;
}

.order-date {
  color: #718096;
  font-size: 0.9em;
}

.order-status {
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9em;
}

.order-status.success {
  background-color: #c6f6d5;
  color: #276749;
}

.order-status.pending {
  background-color: #fed7aa;
  color: #9a3412;
}

.order-status.processing {
  background-color: #bfdbfe;
  color: #1e40af;
}

.order-status.shipped {
  background-color: #a5f3fc;
  color: #0e7490;
}

.order-status.cancelled {
  background-color: #fecaca;
  color: #b91c1c;
}

.order-details {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
}

.recipient-info, .order-items {
  background-color: #f7fafc;
  padding: 20px;
  border-radius: 12px;
}

.recipient-info h4, .order-items h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2d3748;
  font-size: 1.1em;
  font-weight: 600;
  border-left: 3px solid #4a90e2;
  padding-left: 10px;
}

.recipient-info p {
  margin: 10px 0;
  color: #4a5568;
}

.order-items ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #edf2f7;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-name {
  font-weight: 500;
  color: #2d3748;
}

.item-quantity {
  color: #718096;
  font-size: 0.9em;
  background-color: #edf2f7;
  padding: 3px 8px;
  border-radius: 4px;
}

.item-price {
  font-weight: 600;
  color: #4a5568;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px dashed #edf2f7;
  font-weight: 600;
}

.total-amount {
  color: #e53e3e;
  font-size: 1.2em;
}

.order-actions {
  padding: 0 20px 20px;
  display: flex;
  justify-content: flex-end;
}

.btn-cancel-order {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel-order:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
}

@media (max-width: 768px) {
  .history-container {
    padding: 80px 15px 30px;
  }
  
  .order-details {
    grid-template-columns: 1fr;
  }
  
  .history-title {
    font-size: 1.6rem;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .order-status {
    align-self: flex-start;
  }
}
</style>