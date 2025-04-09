<template>
  <div id="app">
    <!-- Header ở trên cùng -->
    <Header />

    <!-- Nội dung chính hiển thị thông qua router-view -->
    <main>
      <router-view />
    </main>

    <!-- Footer ở dưới cùng -->
    <Footer />
  </div>
</template>

<script>
// Import các thành phần Header và Footer
import Header from "./components/ComHeader.vue";
import Footer from "./components/ComFooter.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1; /* Phần main sẽ chiếm không gian còn lại của trang */
  padding: 20px; /* Khoảng đệm cho nội dung để dễ đọc hơn */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
