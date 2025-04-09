<template>
  <div class="form-container d-flex justify-content-center align-items-center">
    <div class="card register-card shadow-lg p-4">
      <div class="card-body">
        <h2 class="card-title text-center mb-4 text-primary">Đăng Ký Tài Khoản</h2>
        <form @submit.prevent="register" class="needs-validation" novalidate>
          <div class="mb-3">
            <label for="username" class="form-label">Tên đăng nhập:</label>
            <input
              v-model="username"
              type="text"
              class="form-control"
              id="username"
              placeholder="Nhập tên đăng nhập"
              required
            />
            <div class="invalid-feedback">Vui lòng nhập tên đăng nhập.</div>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              id="email"
              placeholder="Nhập địa chỉ email"
              required
            />
            <div class="invalid-feedback">Vui lòng nhập địa chỉ email hợp lệ.</div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu:</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Nhập mật khẩu"
              required
            />
            <div class="invalid-feedback">Vui lòng nhập mật khẩu.</div>
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Xác nhận mật khẩu:</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="form-control"
              id="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              required
            />
            <div class="invalid-feedback">Vui lòng xác nhận mật khẩu.</div>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
            {{ isLoading ? 'Đang xử lý...' : 'Đăng Ký' }}
          </button>
          <p v-if="error" class="text-danger mt-3 text-center">{{ error }}</p>
          <p v-if="success" class="text-success mt-3 text-center">{{ success }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from "@/services/api";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: "",
      success: "",
      isLoading: false
    };
  },
  methods: {
    async register() {
      this.error = "";
      this.success = "";

      if (this.username.trim() === "" || this.username.length < 3) {
        this.error = "Tên đăng nhập phải có ít nhất 3 ký tự";
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.error = "Địa chỉ email không hợp lệ";
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.error = "Mật khẩu và xác nhận mật khẩu không trùng khớp";
        return;
      }

      if (this.password.length < 6) {
        this.error = "Mật khẩu phải có ít nhất 6 ký tự";
        return;
      }

      try {
        this.isLoading = true;
        await authAPI.register({
          username: this.username,
          email: this.email,
          password: this.password
        });

        this.success = "Đăng ký thành công!";
        this.error = "";
        this.username = "";
        this.email = "";
        this.password = "";
        this.confirmPassword = "";

        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (err) {
        if (err.response?.data?.message) {
          this.error = err.response.data.message;
        } else {
          this.error = "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.";
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
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
  background: url('https://wallpapercave.com/wp/wp4883875.jpg');
  background-size: cover;
  background-position: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.register-card {
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

.card-title {
  font-size: 28px;
  text-align: center;
  margin-bottom: 10px;
  font-weight: 300;
  letter-spacing: 2px;
  color: white;
}

.form-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-left: 3px solid #00BCD4;
  color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-control:focus {
  background: rgba(255, 255, 255, 0.2);
}

.btn-primary {
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

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #00BCD4;
  transform: none;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.text-danger,
.text-success {
  font-size: 14px;
  text-align: center;
  margin-top: 15px;
}

.text-danger {
  color: #ff6b6b;
}

.text-success {
  color: #00BCD4;
}

@media (max-width: 576px) {
  .register-card {
    padding: 30px 20px;
  }
  
  .card-title {
    font-size: 24px;
  }
  
  .form-control {
    padding: 10px 15px;
  }
}
</style>