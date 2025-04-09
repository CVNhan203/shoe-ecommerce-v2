<template>
  <div class="contact-container">
    <!-- Image at the top -->
    <img src="@/assets/view1.jpg" alt="Contact Image" class="contact-image">
    
    <h2>AnnasSneaker – Đôi giày không chỉ là phụ kiện, mà là phong cách, sự tự do và đam mê chinh phục mọi nẻo đường.</h2>
    <div class="contact-info">
      <p class="address">
        <strong>Địa chỉ:</strong><br>
        Trụ sở chính: 289 Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh, Thành phố Hồ Chí Minh<br>
        Chi nhánh Đà Lạt: 7 Nguyễn Chí Thanh, phường 1, Thành phố Đà Lạt, tỉnh Lâm Đồng<br>
        Chi nhánh Hà Nội: Lô 04-9A Khu công nghiệp Vĩnh Hoàng, phường Hoàng Văn Thụ, quận Hoàng Mai, Hà Nội
      </p>
      <p><strong>Hotline:</strong> 1900 3013</p>
      <p><strong>Email:</strong> info@phela.vn</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComLienHe'
}
</script>

<style>
.contact-container {
  width: 100%;
  min-height: calc(100vh - 80px); /* Subtract header height */
  margin-top: 80px; /* Add margin for header */
  padding: 40px 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.contact-image {
  width: 100%;
  max-width: 1000px;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.contact-image:hover {
  transform: scale(1.02);
}

h2 {
  font-size: 2.2em;
  margin: 20px 0 30px;
  color: #2c3e50;
  font-weight: 700;
  line-height: 1.4;
  max-width: 800px;
  padding: 0 20px;
}

.contact-info {
  text-align: left;
  margin-top: 20px;
  padding: 35px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  width: 100%;
  transition: transform 0.3s ease;
}

.contact-info:hover {
  transform: translateY(-5px);
}

.contact-info p {
  margin: 15px 0;
  font-size: 1.2em;
  line-height: 1.8;
  color: #444;
}

.contact-info .address {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.contact-info strong {
  color: #1a73e8;
  font-weight: 600;
  font-size: 1.1em;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-container {
    margin-top: 60px;
    padding: 30px 15px;
  }

  h2 {
    font-size: 1.8em;
  }

  .contact-info {
    padding: 25px;
    margin: 0 15px;
  }

  .contact-image {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .contact-container {
    margin-top: 50px;
  }

  h2 {
    font-size: 1.5em;
  }

  .contact-info p {
    font-size: 1.1em;
  }

  .contact-image {
    height: 250px;
  }
}
</style>
