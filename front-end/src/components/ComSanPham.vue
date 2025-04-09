<template>
    <div class="product-container">
        <div class="header-section">
            <h1 class="page-title">SNEAKER</h1>
        </div>
        <div class="container">
            <!-- Hiển thị loading khi đang tải dữ liệu -->
            <div v-if="loading" class="loading">
                <div class="spinner"></div>
                <p>Đang tải sản phẩm...</p>
            </div>
            
            <!-- Hiển thị thông báo lỗi nếu có -->
            <div v-else-if="error" class="error-message">
                {{ error }}
            </div>
            
            <!-- Hiển thị danh sách sản phẩm -->
            <Product v-else v-for="item in paginatedProducts" :key="item._id" :product="item"/>
        </div>

        <!-- Phân Trang -->
        <div class="pagination" v-if="products.length > 0">
            <button :disabled="currentPage === 1" @click="prevPage" class="pagination-btn">Trang trước</button>
                <span>Trang {{ currentPage }} / {{ totalPages }}</span>
            <button :disabled="currentPage === totalPages" @click="nextPage" class="pagination-btn">Trang sau</button>
        </div>
    </div>
</template>

<script>
import Product from '@/components/ComProduct.vue';
import axios from 'axios';

export default {
    name:'ComSanPham',
    components:{
        Product
    },
    data(){
        return{
            products: [],
            currentPage: 1, // Trang hiện tại
            itemsPerPage: 8, // Số sản phẩm mỗi trang
            loading: true,
            error: null
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.products.length / this.itemsPerPage);
        },
        
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.products.slice(start, end);
        }
    },
    methods: {
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        async fetchProducts() {
            try {
                this.loading = true;
                const response = await axios.get('http://localhost:3007/api/products');
                this.products = response.data;
                this.loading = false;
            } catch (error) {
                this.error = "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.";
                this.loading = false;
                console.error('Error fetching products:', error);
            }
        }
    },
    created() {
        // Gọi API khi component được tạo
        this.fetchProducts();
    }
}
</script>

<style scoped>
.product-container {
    min-height: 100vh;
    background: #f9f9f9;
    padding-top: 60px; /* Giảm padding */
    width: 100%;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
    overflow-x: hidden;
}

.header-section {
    width: 100%;
    padding: 40px 0; /* Giảm padding */
    background: linear-gradient(135deg, #000000, #333333);
    margin-bottom: 30px; /* Giảm margin */
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80') center/cover no-repeat;
    opacity: 0.2;
    z-index: 0;
}

.page-title {
    position: relative;
    z-index: 1;
    font-size: 3.5em;
    font-weight: 800;
    color: #ffffff;
    text-align: center;
    margin: 0;
    letter-spacing: 6px;
    text-transform: uppercase;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}

.container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* Giảm kích thước thẻ */
    gap: 20px; /* Giảm khoảng cách */
    padding: 20px 5%;
    max-width: 1400px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    position: relative;
    background: url(https://wallpapercave.com/wp/wp6431005.jpg);
}

/* Loading spinner styles */
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    width: 100%;
    grid-column: 1 / -1;
}

.spinner {
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 3px solid #000;
    width: 35px;
    height: 35px;
    animation: spin 0.8s linear infinite;
}

.loading p {
    margin-top: 15px;
    color: #555;
    font-size: 1em;
    font-weight: 500;
}

/* Pagination styles */
.pagination {
    margin: 20px 0 40px; /* Giảm margin */
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.pagination-btn {
    padding: 10px 25px;
    border: none;
    border-radius: 4px;
    background: #000;
    color: white;
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pagination-btn:hover:not(:disabled) {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.pagination-btn:disabled {
    background: #ddd;
    cursor: not-allowed;
    color: #999;
}

.pagination span {
    font-size: 1em;
    color: #444;
    font-weight: 500;
}

.error-message {
    color: #721c24;
    text-align: center;
    padding: 25px;
    font-size: 1em;
    background-color: #f8d7da;
    border-radius: 6px;
    margin: 25px auto;
    max-width: 700px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
    grid-column: 1 / -1;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .container {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Giảm kích thước trên mobile */
        padding: 15px 4%;
        gap: 15px;
    }

    .page-title {
        font-size: 2.2em;
        letter-spacing: 3px;
    }

    .pagination {
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 40px;
    }
    
    .header-section {
        padding: 35px 0;
    }
}
</style>
