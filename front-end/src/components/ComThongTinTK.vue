<template>
  <div class="profile-container">
    <h2>Thông Tin Tài Khoản</h2>
    <div class="profile-content">
      <div class="profile-section">
        <div class="profile-avatar">
          <div class="avatar-circle" v-if="!user.avatar">
            {{ getUserInitial() }}
          </div>
          <img v-else :src="user.avatar" alt="User Avatar" />
        </div>
        <div class="profile-details">
          <div class="info-group">
            <label>Tên đăng nhập:</label>
            <span>{{ user.username }}</span>
          </div>
          <div class="info-group">
            <label>Email:</label>
            <span>{{ user.email }}</span>
          </div>
          <div class="info-group">
            <label>Số điện thoại:</label>
            <span>{{ user.phone || 'Chưa cập nhật' }}</span>
          </div>
          <div class="info-group">
            <label>Địa chỉ:</label>
            <span>{{ user.address || 'Chưa cập nhật' }}</span>
          </div>
          
          <!-- Phần mật khẩu -->
          <div class="password-section">
            <h3>Thay đổi mật khẩu</h3>
            <div class="form-group">
              <label for="currentPassword">Mật khẩu hiện tại:</label>
              <input type="password" id="currentPassword" v-model="passwordData.currentPassword" />
            </div>
            <div class="form-group">
              <label for="newPassword">Mật khẩu mới:</label>
              <input type="password" id="newPassword" v-model="passwordData.newPassword" />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Xác nhận mật khẩu mới:</label>
              <input type="password" id="confirmPassword" v-model="passwordData.confirmPassword" />
            </div>
            <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
            <div class="success-message" v-if="successMessage">{{ successMessage }}</div>
            <button class="change-password-btn" @click="changePassword">Đổi mật khẩu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/services/api';

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('currentUser')) || {},
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    getUserInitial() {
      return this.user.username ? this.user.username.charAt(0).toUpperCase() : 'U';
    },
    async changePassword() {
      this.errorMessage = '';
      this.successMessage = '';
      
      // Kiểm tra mật khẩu mới và xác nhận mật khẩu
      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.errorMessage = 'Mật khẩu mới và xác nhận mật khẩu không khớp';
        return;
      }
      
      // Kiểm tra độ dài mật khẩu
      if (this.passwordData.newPassword.length < 6) {
        this.errorMessage = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        return;
      }
      
      try {
        await authAPI.changePassword({
          currentPassword: this.passwordData.currentPassword,
          newPassword: this.passwordData.newPassword
        });
        
        this.successMessage = 'Đổi mật khẩu thành công';
        // Reset form
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi đổi mật khẩu';
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 80px auto 20px;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.profile-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 30px;
}

.profile-section {
  display: flex;
  gap: 30px;
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ff6f61;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: bold;
}

.profile-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-details {
  flex-grow: 1;
}

.info-group {
  margin-bottom: 20px;
}

.info-group label {
  display: block;
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.info-group span {
  display: block;
  color: #333;
  font-size: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

/* Password section styles */
.password-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.password-section h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.error-message {
  color: #e74c3c;
  margin: 10px 0;
  font-size: 14px;
}

.success-message {
  color: #2ecc71;
  margin: 10px 0;
  font-size: 14px;
}

.change-password-btn {
  background-color: #ff6f61;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.change-password-btn:hover {
  background-color: #e74c3c;
}

@media (max-width: 768px) {
  .profile-section {
    flex-direction: column;
    align-items: center;
  }

  .profile-avatar {
    margin-bottom: 20px;
  }

  .profile-details {
    width: 100%;
  }
}
</style>