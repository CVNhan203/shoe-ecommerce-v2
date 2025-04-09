<template>
  <footer class="main-footer">
    <div class="footer-container">
      <!-- Logo và thông tin doanh nghiệp -->
      <div class="footer-section company-info">
        <img src="@/assets/Logo.png" alt="Authentic Shoes Logo" class="footer-logo" />
        <p>Hộ Kinh Doanh Cao Văn Nhân MST: 01E8027929</p> 
        <p>Annas Sneaker - Nhà sưu tầm và phân phối chính hãng các thương hiệu sneaker quốc tế hàng đầu Việt Nam</p>
        
        <!-- Hệ thống cửa hàng -->
        <div class="footer-section store-info">
        <h3>Hệ Thống Cửa Hàng</h3>
        <ul>
          <li>
            <p>Cơ sở 1: 561 Nguyễn Đình Chiểu Phường 2 Quận 3 - HCM</p>
            <p>Hotline: 0786665444</p>
          </li>
          <li>
            <p>Cơ sở 2: 70-72 Tây Sơn, Đống Đa, Hà Nội</p>
            <p>Hotline: 0785499555</p>
          </li>
        </ul>
        <p>Email: <a href="mailto:Service@AnnasSneaker.com">Service@AnnasSneaker.com</a></p>
      </div>

        <p>ĐKKD: 01E8027929 - Cấp ngày: 01/06/2019 - Nơi cấp: TP HCM</p>
      </div>

     
     
      <!-- Về chúng tôi và các icon -->
      <div class="footer-section about-us">
        <h3>Về chúng tôi</h3>
        <ul>
          <li><a href="#">Giới Thiệu</a></li>
          <li><a href="#">Tuyển Dụng</a></li>
          <li><a href="#">Dịch Vụ Spa, Sửa Giày</a></li>
          <li><a href="#">Tin Tức - Sự Kiện</a></li>
        </ul>
      <div class="footer-section social-media">
        <h3>Kết nối với chúng tôi</h3>
        <div class="social-icons">
          <a href="#" class="facebook"><i class="fab fa-facebook"></i></a>
          <a href="#" class="instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" class="tiktok"><i class="fab fa-tiktok"></i></a>
          <a href="#" class="twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" class="youtube"><i class="fab fa-youtube"></i></a>
        </div>
          <div class="bo-cong-thuong">
            <img src="@/assets/Dathongbao.jpg" alt="Đã Thông Báo Bộ Công Thương" />
          </div>
      </div>
    </div>
      

      <!-- Hỗ trợ khách hàng -->
      <div class="footer-section customer-support">
        <h3>Hỗ trợ khách hàng</h3>
        <ul>
          <li><a href="#">Hướng dẫn mua hàng</a></li>
          <li><a href="#">Chính sách đổi trả và bảo hành</a></li>
          <li><a href="#">Chính Sách Thanh Toán</a></li>
          <li><a href="#">Điều khoản trang web</a></li>
          <li><a href="#">Chính sách bảo vệ thông tin cá nhân</a></li>
          <li><a href="#">Vận chuyển và giao hàng</a></li>
        </ul>
      </div> 
    </div>
  </footer>
</template>

<script>
export default {};
</script>


<style scoped>
.main-footer {
  color: #000;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 2px solid #000;
  background-color:#000;
  position: relative; 
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
  
}

.footer-section {
  flex: 1;
  min-width: 250px;
  padding: 10px;
}

.company-info {
  flex: 2;
  max-width: 550px;
  line-height: 1.6;
}

.footer-logo {
  max-width: 150px;
  margin-bottom: 20px;
}

.store-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 2;
}

.store-info ul li {
  margin-bottom: 20px;
}

.store-info p,
.company-info p,
.customer-support ul li,
.about-us ul li {
  font-size: 14px;
  color: #ffffff;
}

.about-us,
.customer-support {
  flex: 1;
}

.about-us ul,
.customer-support ul {
  list-style: none;
  padding: 0;
  line-height: 3;
}

.about-us ul li,
.customer-support ul li {
  margin-bottom: 10px;
}

.about-us ul li a,
.customer-support ul li a {
  text-decoration: none;
  color: #ffffff;
  transition: color 0.3s;
}

.about-us ul li a:hover,
.customer-support ul li a:hover {
  color: rgb(0, 149, 255);
}

.social-media {
  margin-top: 20px;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.social-icons a {
  color:#ffffff;
  font-size: 30px;
  transition: color 0.3s;
}


.social-icons a.facebook:hover {
  color: #3b5998;
  transform: scale(1.2);
}
.social-icons a.instagram:hover {
  color: #e4405f;
  transform: scale(1.2);
}
.social-icons a.tiktok:hover {
  color: #69c9d0;
  transform: scale(1.2);
}
.social-icons a.twitter:hover {
  color: #1da1f2;
  transform: scale(1.2);
}
.social-icons a.youtube:hover {
  color: #ff0000;
  transform: scale(1.2);
}

.bo-cong-thuong {
  margin-top: 20px;
  text-align: left;
}

.bo-cong-thuong img {
  max-width: 200px;
  height: auto;
}

h3 {
  font-size: 20px;
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 15px;
  color: #ffffff;
}

a {
  color: inherit;
  text-decoration: none;
}
</style>

