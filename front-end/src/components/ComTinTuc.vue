<template>
  <div class="page-container">
    <h1 class="page-title">Tin tức</h1>
    <div class="breadcrumb">
      <span class="phela">Trangchu</span> > <span class="tintuc">Tin tức</span>
    </div>
    <div class="news-grid">
      <div class="news-item" v-for="(news, index) in newsList" :key="index">
        <div class="news-image-container">
          <img :src="news.image" :alt="news.title" class="news-image" />
        </div>
        <div class="news-content">
          <h2 class="news-title">{{ news.title }}</h2>
          <p class="news-description">{{ news.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComTinTuc',
  data() {
    return {
      newsList: [
        {
          title: 'CUỘC THI NGƯỜI ĐẸP VÌ GIÀY',
          description: 'Mượt mà như dải ngân hà – Annas chăm chút trên từng con beat....:>',
          image: 'https://wallpapercave.com/wp/wp6295348.jpg',
        },
        {
          title: 'Không Mua Giày Tôi Bán Bị Đấm Đen Mắt Nên Phải Đeo Mắt KÍnh',
          description: 'Nhớ mua giày đều đặn nha ae :)))',
          image: 'https://wallpapercave.com/wp/wp7821787.jpg', 
        },
        {
          title: 'Tin nóng: "Giày Siêu Thông Minh Chống Đọc Tâm Trí Ra Mắt',
          description: 'Có Khả Năng Giúp Chủ Nhân Điều Khiển Máy Tính Bằng Ý Nghĩa!',
          image: 'https://wallpapercave.com/wp/wp6430617.jpg',
        }
      ]
    };
  }
}
</script>

<style scoped>
.page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 100px 24px;
}

.page-title {
  font-size: 2.5rem; /* 40px */
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.breadcrumb {
  margin: 0 0 3rem;
  font-size: 0.875rem; /* 14px */
  color: #6b7280;
  text-align: center;
}

.phela {
  color: #d97706;
  font-weight: 500;
}

.tintuc {
  color: #6b7280;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem; /* 32px */
}

.news-item {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.news-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 7px 14px rgb(0 0 0 / 0.1), 0 3px 6px rgb(0 0 0 / 0.08);
}

.news-image-container {
  position: relative;
  padding-top: 66.67%; /* 3:2 aspect ratio */
  overflow: hidden;
}

.news-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.news-item:hover .news-image {
  transform: scale(1.03);
}

.news-content {
  padding: 1.5rem; /* 24px */
}

.news-title {
  font-size: 1.25rem; /* 20px */
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2a44;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-description {
  font-size: 0.9375rem; /* 15px */
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem; /* 32px */
  }
}

@media (max-width: 640px) {
  .news-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .page-container {
    padding: 2rem 1rem;
  }
  
  .page-title {
    font-size: 1.75rem; /* 28px */
  }
  
  .news-content {
    padding: 1.25rem;
  }
  
  .news-title {
    font-size: 1.125rem; /* 18px */
  }
}
</style>