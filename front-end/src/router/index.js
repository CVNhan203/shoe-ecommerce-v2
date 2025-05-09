import { createWebHistory,createRouter } from "vue-router";
import Home from '@/components/ComHome.vue'
import SanPham from '@/components/ComSanPham.vue'
import ThanhToan from '@/components/ComThanhToan.vue'
// import LichSuThanhToan from '@/components/ComPaymentHistory.vue'
import GioiThieu from '@/components/ComGioiTh.vue'
import LienHe from '@/components/ComLienHe.vue'
import TinTuc from '@/components/ComTinTuc.vue'
import ProductDetail from '@/components/ComProductDetail.vue'
import Cart from '@/components/ComCart.vue'
import Register from '@/components/ComRegister.vue'
import Login from '@/components/ComLogin.vue'
import SearchResult from '@/components/ComSearchResult.vue'
import ThongTinTK from '@/components/ComThongTinTK.vue'
import ComHistory from '@/components/ComHistory.vue'

// tạo mảng chứa những đường link
const routes=[
    // đối tượng trang chủ
    {
        path:"/",
        name:"Home",
        component:Home
    },
    // đường link ko phải là trang chủ path:"/ten"
    {
        path:"/sanpham",
        name:"SanPham",
        component:SanPham
    },
    {
        path:"/thanhtoan",
        name:"ThanhToan",
        component:ThanhToan
    },
    
    {
        path:"/gioithieu",
        name:"GioiThieu",
        component:GioiThieu
    },
    {
        path:"/lienhe",
        name:"LienHe",
        component:LienHe
    },
    {
        path:"/tintuc",
        name:"TinTuc",
        component:TinTuc
    },

    // duong link truyen di
    {
        path:"/product/:id",
        name:"ProductDetail",
        component:ProductDetail
    },
    {
        path:"/cart",
        name:"Cart",
        component:Cart
    },
    {
        path:"/register",
        name:"Register",
        component:Register
    },
    {
        path:"/login",
        name:"Login",
        component:Login
    },
    {
        path:"/search",
        name:"SearchResult",
        component:SearchResult
    },
    // Thêm route cho trang thông tin tài khoản
    {
        path:"/users/current",
        name:"ThongTinTK",
        component:ThongTinTK,
        meta: { requiresAuth: true }
    },
    {
        path: '/history',
        name: 'History',
        component: ComHistory,
        meta: { requiresAuth: true }
    }
]

// tạo đối tượng router
const router=createRouter({
    history:createWebHistory(),
    routes
})

// Thêm navigation guard để kiểm tra xác thực
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router