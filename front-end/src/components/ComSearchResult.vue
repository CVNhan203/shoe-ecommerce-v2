<template>
  <div class="search-results">
    <div class="search-header">
      <h2>Kết quả tìm kiếm cho: "{{ searchQuery }}"</h2>
      <div class="search-filters">
        <!-- Category filter -->
        <div class="filter-group">
          <label for="category">Danh mục:</label>
          <select id="category" v-model="selectedCategory" class="filter-select" @change="performSearch">
            <option value="">Tất cả danh mục</option>
            <option value="sneaker">Sneaker</option>
            <option value="sport">Sport</option>
            <option value="casual">Casual</option>
          </select>
        </div>

        <!-- Price range filter -->
        <div class="filter-group">
          <label for="price">Khoảng giá:</label>
          <select id="price" v-model="priceRange" class="filter-select" @change="performSearch">
            <option value="">Tất cả giá</option>
            <option value="0-500000">Dưới 500.000đ</option>
            <option value="500000-1000000">500.000đ - 1.000.000đ</option>
            <option value="1000000-2000000">1.000.000đ - 2.000.000đ</option>
            <option value="2000000+">Trên 2.000.000đ</option>
          </select>
        </div>

        <!-- Sort options -->
        <div class="filter-group">
          <label for="sort">Sắp xếp:</label>
          <select id="sort" v-model="sortOption" class="filter-select" @change="performSearch">
            <option value="">Mặc định</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="name-asc">Tên: A-Z</option>
            <option value="name-desc">Tên: Z-A</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Đang tìm kiếm...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Results -->
    <div v-else class="search-content">
      <div v-if="filteredProducts.length" class="product-list">
        <div class="product-card" v-for="item in sortedProducts" :key="item._id">
          <div class="image-container">
            <img :src="item.image" :alt="item.name" class="product-image" />
          </div>
          <div class="product-info">
            <h3>{{ item.name }}</h3>
            <p class="category">{{ item.category }}</p>
            <p class="price">{{ formatPrice(item.price) }} ₫</p>
            <router-link :to="'/product/' + item._id" class="btn btn-primary">
              Xem Chi Tiết
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- No results -->
      <div v-else class="no-results">
        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
        <button class="btn btn-secondary" @click="resetFilters">
          Xóa bộ lọc
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: this.$route.query.name || "",
      selectedCategory: "",
      priceRange: "",
      sortOption: "",
      filteredProducts: [],
      loading: false,
      error: null
    };
  },

  computed: {
    sortedProducts() {
      let products = [...this.filteredProducts];
      
      switch (this.sortOption) {
        case 'price-asc':
          return products.sort((a, b) => a.price - b.price);
        case 'price-desc':
          return products.sort((a, b) => b.price - a.price);
        case 'name-asc':
          return products.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
          return products.sort((a, b) => b.name.localeCompare(a.name));
        default:
          return products;
      }
    }
  },

  methods: {
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    async performSearch() {
      try {
        this.loading = true;
        this.error = null;

        const params = new URLSearchParams();
        if (this.searchQuery) params.append('search', this.searchQuery);
        if (this.selectedCategory) params.append('category', this.selectedCategory);
        if (this.priceRange) {
          const [min, max] = this.priceRange.split('-');
          if (min) params.append('minPrice', min);
          if (max && max !== '+') params.append('maxPrice', max);
        }

        const response = await axios.get(`http://localhost:3007/api/products/search?${params.toString()}`);
        this.filteredProducts = response.data;
      } catch (error) {
        console.error('Error searching products:', error);
        this.error = "Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.";
      } finally {
        this.loading = false;
      }
    },

    resetFilters() {
      this.selectedCategory = "";
      this.priceRange = "";
      this.sortOption = "";
      this.performSearch();
    }
  },

  watch: {
    "$route.query.name"(newQuery) {
      this.searchQuery = newQuery;
      this.performSearch();
    }
  },

  created() {
    this.performSearch();
  }
};
</script>

<style scoped>
.search-results {
  padding: 90px 20px 40px;
  min-height: 100vh;
  background: url(https://wallpapercave.com/wp/wp6431005.jpg) center/cover fixed;
}

.search-header {
  max-width: 1200px;
  margin: 0 auto 30px;
}

.search-header h2 {
  font-size: 30px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: #333;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  min-width: 200px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  width: 300px;
  background-color: #fdf5e6;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: #f5f5f5;
}

.product-card h3 {
  font-size: 18px;
  color: #000000;
  font-weight: bold;
  margin: 8px 0;
  line-height: 1.4;
}

.product-card p {
  font-size: 14px;
  color: #000000;
  margin: 6px 0;
  line-height: 1.6;
}

.product-card p:last-of-type {
  font-weight: bold;
  color: #d32f2f;
}

.btn-primary {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 16px;
  background-color: #d32f2f;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  border-radius: 6px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary:hover {
  background-color: #b71c1c;
  transform: scale(1.05);
}

.search-results p {
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 3px solid #000;
  width: 30px;
  height: 30px;
  animation: spin 0.8s linear infinite;
}

.error-message {
  text-align: center;
  padding: 20px;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  margin: 20px auto;
  max-width: 600px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

  