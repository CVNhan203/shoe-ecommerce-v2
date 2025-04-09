<template>
  <div class="form-container">
    <div class="login-form">
      <h2 class="form-title">Đăng Nhập</h2>
      <p class="form-subtitle">Vui lòng nhập thông tin đăng nhập</p>
      
      <form @submit.prevent="login">
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Email"
            required
          />
          <div class="icon-container">
            <i class="fas fa-envelope"></i>
          </div>
        </div>
        
        <div class="input-group">
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Mật khẩu"
            required
          />
          <div class="icon-container">
            <i class="fas fa-lock"></i>
          </div>
        </div>
        
        <div class="form-options">
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="rememberMe" />
            <label for="remember">Ghi nhớ đăng nhập</label>
          </div>
          <router-link to="/forgot-password" class="forgot-password">Quên mật khẩu?</router-link>
        </div>
        
        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Đang xử lý...' : 'Đăng Nhập' }}
        </button>
        
        <p class="error-message">{{ error }}</p>
      </form>
      
      <div class="form-footer">
        Chưa có tài khoản? <router-link to="/register" class="register-link">Đăng ký ngay</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/services/api';
import eventBus from "@/eventBus";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      isLoading: false,
      rememberMe: false
    };
  },
  methods: {
    async login() {
      this.error = "";
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.error = "Email không hợp lệ";
        return;
      }

      try {
        this.isLoading = true;
        const response = await authAPI.login({
          email: this.email,
          password: this.password
        });

        // Lưu token
        const token = response.data.accessToken;
        localStorage.setItem('token', token);
        
        // Lấy thông tin user
        const userResponse = await authAPI.getCurrentUser();
        const user = userResponse.data;
        
        // Lưu thông tin user
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        // Thông báo đăng nhập thành công
        eventBus.emit("loginSuccess", user);
        
        // Chuyển hướng về trang chủ
        this.$router.push("/");
      } catch (error) {
        if (error.response?.data?.message) {
          this.error = error.response.data.message;
        } else {
          this.error = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: url('https://wallpapercave.com/wp/wp5023190.jpg');
  background-size: cover;
  background-position: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.login-form {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  color: white;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-title {
  font-size: 28px;
  text-align: center;
  margin-bottom: 10px;
  font-weight: 300;
  letter-spacing: 2px;
}

.form-subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
  font-size: 14px;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  padding-left: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-left: 3px solid #00BCD4;
  color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input-group input:focus {
  background: rgba(255, 255, 255, 0.2);
}

.icon-container {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: #00BCD4;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  color: white;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 8px;
}

.forgot-password {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: #00BCD4;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 15px;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #00BCD4;
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  font-size: 14px;
  margin-top: 15px;
}

.form-footer {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 576px) {
  .login-form {
    padding: 30px 20px;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .input-group input {
    padding: 10px 15px;
  }
  
  .icon-container {
    width: 32px;
    height: 32px;
  }
}
.register-link {
  color: #00BCD4;
  text-decoration: none;
  transition: color 0.3s;
}

.register-link:hover {
  color: #fff;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>