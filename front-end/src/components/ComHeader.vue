<template>
  <header class="main-header">
    <div class="top-bar">
      <div class="top-bar-links">
        <a href="#">Help</a>
        <span>|</span>
        <!-- Hiển thị Join Us và Sign In nếu chưa đăng nhập -->
        <router-link to="/register" v-if="!user">Sign Up</router-link>
        <span v-if="!user">|</span>
        <router-link to="/login" v-if="!user">Sign In</router-link>
        
        <!-- Hiển thị icon người dùng và nút đăng xuất nếu đã đăng nhập -->
        <div class="user-section" v-if="user">
          <router-link to="/users/current" class="user-profile">
            <div class="user-icon">
              <span v-if="!user.avatar">{{getUserInitial()}}</span>
              <img v-else :src="user.avatar" alt="User Avatar" />
            </div>
          </router-link>
          <a href="#" @click.prevent="logout" class="logout-link">Đăng xuất</a>
        </div>
      </div>
    </div>
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <img :src="require('@/assets/Logo.png')" alt="Logo" />
        </router-link>
      </div>
      <nav>
        <ul class="menu">
          <li><router-link to="/">TRANG CHỦ</router-link></li>
          <li><router-link to="/sanpham">SẢN PHẨM</router-link></li>
          <li><router-link to="/gioithieu">CÂU CHUYỆN THƯƠNG HIỆU</router-link></li>
          <li><router-link to="/tintuc">TIN TỨC</router-link></li>
          <li><router-link to="/lienhe">LIÊN HỆ</router-link></li>
          <li><router-link to="/history">LỊCH SỬ ĐƠN HÀNG</router-link></li>
        </ul>
      </nav>
      <div class="header-actions">
        <div class="header-search">
          <input
            type="text"
            v-model="searchKey"
            class="form-control"
            placeholder="Search"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <router-link to="/wishlist" class="wishlist-icon">
          <i class="fa-regular fa-heart"></i>
        </router-link>
        <router-link to="/cart" class="cart-icon">
          <i class="fa-solid fa-shopping-cart"></i>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import eventBus from "@/eventBus";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("currentUser")) || null,
      searchKey: "",
    };
  },
  created() {
    eventBus.on("loginSuccess", (user) => {
      this.user = user;
    });
  },
  beforeUnmount() {
    eventBus.off("loginSuccess");
  },
  methods: {
    logout() {
      localStorage.removeItem("currentUser");
      this.user = null;
      this.$router.push("/");
    },
    handleSearch() {
      if (this.searchKey.trim()) { // Chỉ điều hướng nếu có từ khóa
        this.$router.push({ path: "/search", query: { name: this.searchKey.trim() } });
        this.searchKey = ""; // Reset input sau khi tìm kiếm
      }
    },
    getUserInitial() {
      return this.user && this.user.username ? this.user.username.charAt(0).toUpperCase() : 'U';
    }
  },
};
</script>

<style scoped>
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #fff;
  font-family: 'Arial', sans-serif;
}

/* Top Bar */
.top-bar {
  background-color: #f5f5f5;
  padding: 5px 20px;
  font-size: 12px;
  text-align: right;
}

.top-bar-links a {
  color: #333;
  text-decoration: none;
  margin: 0 8px;
  transition: color 0.3s ease;
}

.top-bar-links a:hover {
  color: #ff6f61;
}

.top-bar-links span {
  color: #999;
}

/* User Section */
.user-section {
  display: inline-flex;
  align-items: center;
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ff6f61;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  margin-right: 8px;
}

.user-icon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-section span {
  margin: 0 8px;
  color: #333;
}

.user-section a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.user-section a:hover {
  color: #ff6f61;
}

/* Header Container */
.header-container {
  max-width: 1400px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin: 0 auto;
}

/* Logo */
.logo img {
  height: 30px;
  transition: transform 0.3s ease;
}

.logo img:hover {
  transform: scale(1.1);
}

/* Menu */
nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.menu {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.menu li a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  font-weight: 500;
  text-transform: uppercase;
  padding: 10px 15px;
  transition: color 0.3s ease;
}

.menu li a:hover {
  color: #ff6f61;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Search Bar */
.header-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 6px 12px;
  transition: background-color 0.3s ease;
}

.header-search:hover {
  background-color: #e0e0e0;
}

.header-search input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
  width: 120px; /* Kích thước phù hợp */
}

.header-search input::placeholder {
  color: #999;
}

.header-search button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #333;
  font-size: 16px;
  transition: color 0.3s ease;
}

.header-search button:hover {
  color: #ff6f61;
}

/* Icons */
.wishlist-icon,
.cart-icon {
  color: #333;
  font-size: 18px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.wishlist-icon:hover,
.cart-icon:hover {
  color: #ff6f61;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    padding: 10px;
  }

  .top-bar {
    text-align: center;
    padding: 5px 10px;
  }

  .top-bar-links a {
    margin: 0 5px;
  }

  .user-icon {
    width: 25px;
    height: 25px;
    font-size: 12px;
  }
  
  .user-section span {
    margin: 0 5px;
    font-size: 12px;
  }

  .menu {
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  .header-actions {
    margin-top: 10px;
  }

  .header-search input {
    width: 100px;
  }
}

@media (max-width: 480px) {
  .logo img {
    height: 25px;
  }

  .menu li a {
    font-size: 12px;
    padding: 8px 12px;
  }

  .header-search {
    padding: 5px 10px;
  }

  .header-search input {
    font-size: 12px;
    width: 80px;
  }

  .wishlist-icon,
  .cart-icon {
    font-size: 16px;
  }
  
  .user-icon {
    width: 22px;
    height: 22px;
    font-size: 10px;
  }
  
  .user-section span {
    font-size: 11px;
  }

  .user-profile {
  text-decoration: none;
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.logout-link {
  color: #333;
  text-decoration: none;
  font-size: 12px;
  transition: color 0.3s ease;
}

.logout-link:hover {
  color: #ff6f61;
}
}
</style>