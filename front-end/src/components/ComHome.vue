<template>
  <header class="main-home">
    <div class="home">
      <!-- Carousel -->
      <div
        id="carouselExampleIndicators"
        class="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="@/assets/view1.jpg" class="d-block w-100 carousel-image" alt="View 1" />
          </div>
          <div class="carousel-item">
            <img src="@/assets/view2.jpg" class="d-block w-100 carousel-image" alt="View 2" />
          </div>
          <div class="carousel-item">
            <img src="@/assets/view3.jpg" class="d-block w-100 carousel-image" alt="View 3" />
          </div>
          <div class="carousel-item">
            <img src="@/assets/view4.jpg" class="d-block w-100 carousel-image" alt="View 4" />
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      <!-- Tiêu đề sản phẩm nổi bật -->
      <h1 class="title">Các Sản Phẩm Nổi Bật</h1>

      <!-- Hình ảnh thumbnails -->
      <div class="image-row">
        <img
          v-for="(thumbnail, index) in thumbnails"
          :key="index"
          :src="thumbnail"
          :alt="'Thumbnail ' + (index + 1)"
          class="image-thumbnail"
        />
      </div>

      <!-- Nội dung chào mừng -->
      <div class="home-content">
        <h1>WELCOME</h1>
        <p>
          "Khám phá thế giới sneaker đẳng cấp tại cửa hàng của chúng tôi - nơi hội tụ những mẫu giày hot nhất, độc đáo nhất và giá cả phải chăng nhất. Đến ngay để bước đi phong cách và khẳng định chất riêng của bạn!"
        </p>
        <button class="explore-btn" @click="$router.push('/sanpham')">
          Xem Tất Cả Sản Phẩm
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import view1 from "@/assets/view1.jpg";
import view2 from "@/assets/view2.jpg";
import view3 from "@/assets/view3.jpg";
import view4 from "@/assets/view4.jpg";
import thumb1 from "@/assets/thumb1.png";
import thumb2 from "@/assets/thumb2.png";
import thumb3 from "@/assets/thumb3.png";
import thumb4 from "@/assets/thumb4.jpg";
import thumb5 from "@/assets/thumb5.jpg";
import thumb6 from "@/assets/thumb6.jpeg";
import thumb7 from "@/assets/thumb7.jpg";
import thumb8 from "@/assets/thumb8.jpg";

export default {
  name: "ComHome",
  data() {
    return {
      views: [view1, view2, view3, view4],
      thumbnails: [thumb1, thumb2, thumb3, thumb4, thumb5, thumb6, thumb7, thumb8],
    };
  },
};
</script>

<style scoped>
.main-home {
  margin: 0;
  padding: 0;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
}

.home {
  margin: 0;
  padding: 0;
  width: 100vw;
  overflow-x: hidden;
}

/* Cải thiện Carousel */
.carousel {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #1a1f2c, #2d3436);
}

.carousel-inner,
.carousel-item {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.carousel-item {
  position: relative;
}

.carousel-item.active .carousel-image {
  animation: zoomAnimation 3s linear infinite alternate;
}

.carousel-image {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  filter: brightness(85%) contrast(110%);
  transform-origin: center center;
}

@keyframes zoomAnimation {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.15);
  }
}

/* Thêm overlay cho carousel */
.carousel::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  z-index: 1;
}

/* Điều chỉnh các controls để hiển thị trên overlay */
.carousel-control-prev,
.carousel-control-next,
.carousel-indicators {
  z-index: 2;
}

/* Cải thiện Title section */
.title {
  text-align: center;
  font-size: 3.8em;
  background: linear-gradient(45deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  margin: 60px 0 40px;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  padding-bottom: 25px;
}

/* Cải thiện Image grid */
.image-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 40px;
  background: linear-gradient(135deg, #ffffff, #f0f2f5);
  margin: 20px 0;
  width: 100%;
}

.image-thumbnail {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.image-thumbnail:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  filter: brightness(1.1);
}

/* Cải thiện Welcome section */
.home-content {
  text-align: center;
  padding: 60px;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.home-content h1 {
  font-size: 4.2em;
  background: linear-gradient(45deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  margin-bottom: 30px;
}

.home-content p {
  font-size: 1.4em;
  color: #444;
  line-height: 1.8;
  margin-bottom: 40px;
  max-width: 900px;
  margin: 0 auto 40px;
}

.explore-btn {
  padding: 18px 45px;
  background: linear-gradient(45deg, #ff6f61, #ff8a80);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.3em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(255,111,97,0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.explore-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255,111,97,0.5);
  background: linear-gradient(45deg, #ff8a80, #ff6f61);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .title {
    font-size: 2.8em;
  }
  
  .home-content h1 {
    font-size: 3em;
  }
  
  .home-content p {
    font-size: 1.2em;
  }
  
  .explore-btn {
    padding: 15px 35px;
    font-size: 1.1em;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2.2em;
  }
  
  .home-content {
    padding: 40px 20px;
  }
  
  .image-row {
    padding: 20px;
    gap: 20px;
  }
}
</style>