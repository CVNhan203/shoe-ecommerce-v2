<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h1>Chào Mừng Đến Với AnnasSneaker</h1>
      <p class="intro">
        Từ niềm đam mê mãnh liệt với sneaker, chúng tôi đã xây dựng AnnasSneaker để mang đến cho bạn những đôi giày hoàn hảo nhất. Hãy cùng khám phá hành trình của chúng tôi!
      </p>
      
      <div class="brand-story">
        <h2>Câu Chuyện Thương Hiệu</h2>
        <p>
          AnnasSneaker bắt đầu từ một tình yêu lớn dành cho những đôi giày thể thao. Khởi nguồn từ niềm đam mê của một chàng trai trẻ với sứ mệnh mang đến những đôi sneaker chất lượng, chính hãng và phong cách cho mọi tín đồ yêu giày.
        </p>
        <p>
          Với phương châm <strong>"Mỗi bước chân, mỗi phong cách"</strong>, AnnasSneaker không chỉ cung cấp giày mà còn mang đến sự tự tin cho từng bước chân của bạn. Chúng tôi tự hào là người bạn đồng hành trong hành trình khám phá phong cách của bạn.
        </p>
      </div>

      <div class="mission">
        <h2>Tầm Nhìn & Sứ Mệnh</h2>
        <ul>
          <li>Đảm bảo <strong>100% hàng chính hãng</strong> từ các thương hiệu uy tín.</li>
          <li>Cam kết <strong>chất lượng phục vụ tuyệt vời</strong> cho mọi khách hàng.</li>
          <li>Cung cấp các mẫu sneaker đa dạng, từ cổ điển đến hiện đại.</li>
        </ul>
      </div>

      <div class="cta-section">
        <h3>Hãy Cùng AnnasSneaker Viết Nên Câu Chuyện Của Bạn</h3>
        <p>Khám phá ngay bộ sưu tập sneaker mới nhất và bắt đầu hành trình của riêng bạn với chúng tôi.</p>
        <a href="/sanpham" class="cta-button">Khám Phá Ngay</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComGioiTh'
}
</script>

<style scoped>
:root {
  --primary-color: #3d5afe;
  --secondary-color: #1a1a1a;
  --accent-color: #ffab00;
  --text-color: #ffffff;
  --dark-overlay: rgba(0, 0, 0, 0.75);
  --card-bg: rgba(26, 26, 26, 0.85);
  --font-primary: 'Montserrat', sans-serif;
  --font-secondary: 'Poppins', sans-serif;
}

.page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  background: url('https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80') fixed;
  background-size: cover;
  background-position: center;
  color: var(--text-color);
  font-family: var(--font-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dark-overlay);
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  margin: 40px auto;
}

h1 {
  font-size: 3.5rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 1.5rem;
  font-family: var(--font-primary);
  letter-spacing: 1px;
  text-align: center;
  animation: fadeInDown 1s ease-out;
}

.intro {
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.8;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  border-left: 4px solid var(--accent-color);
  padding-left: 20px;
  text-align: left;
  animation: fadeIn 1.2s ease-out;
}

.brand-story, .mission {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2.5rem;
  margin: 2.5rem auto;
  max-width: 900px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: fadeIn 1.4s ease-out;
}

.brand-story:hover, .mission:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.brand-story h2, .mission h2 {
  color: #ffffff;
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 12px;
  font-family: var(--font-primary);
}

.brand-story h2::after, .mission h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--accent-color);
  border-radius: 3px;
}

.brand-story p {
  margin-bottom: 1.2rem;
  line-height: 1.8;
  font-size: 1.1rem;
  color: #ffffff;
}

.mission ul {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}

.mission li {
  margin-bottom: 1.2rem;
  padding-left: 2.5rem;
  position: relative;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #ffffff;
}

.mission li::before {
  content: '✓';
  position: absolute;
  left: 0;
  font-size: 1.2rem;
  color: var(--accent-color);
  font-weight: bold;
}

.cta-section {
  background: linear-gradient(135deg, var(--primary-color), #304ffe);
  border-radius: 12px;
  padding: 3rem;
  margin: 3rem auto;
  max-width: 900px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(61, 90, 254, 0.3);
  text-align: center;
  animation: fadeIn 1.6s ease-out;
}

.cta-section h3 {
  color: white;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-family: var(--font-primary);
}

.cta-section p {
  font-size: 1.15rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: #ffffff;
}

.cta-button {
  display: inline-block;
  background: var(--accent-color);
  color: var(--secondary-color);
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 1px;
  box-shadow: 0 5px 15px rgba(255, 171, 0, 0.4);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 171, 0, 0.5);
  background: #ff9100;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fadeInDown {
  0% { 
    opacity: 0;
    transform: translateY(-30px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 40px 20px;
    margin: 20px auto;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  .intro {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .brand-story, .mission, .cta-section {
    padding: 1.8rem;
    margin: 1.5rem auto;
  }
  
  .brand-story h2, .mission h2 {
    font-size: 1.8rem;
  }
  
  .cta-section h3 {
    font-size: 1.6rem;
  }
  
  .cta-button {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2rem;
  }
  
  .brand-story h2, .mission h2 {
    font-size: 1.5rem;
  }
  
  .cta-section {
    padding: 1.5rem;
  }
  
  .cta-section h3 {
    font-size: 1.4rem;
  }
}
</style>