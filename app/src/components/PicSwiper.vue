
<template>
  <swiper class="swiper" ref="swiper" :options="swiperOption">
    <swiper-slide>Slide 1</swiper-slide>
    <swiper-slide>Slide 2</swiper-slide>
    <swiper-slide>Slide 3</swiper-slide>
    <swiper-slide>Slide 4</swiper-slide>
    <swiper-slide>Slide 5</swiper-slide>
    <swiper-slide>Slide 6</swiper-slide>
    <swiper-slide>Slide 7</swiper-slide>
    <swiper-slide>Slide 8</swiper-slide>
    <swiper-slide>Slide 9</swiper-slide>
    <swiper-slide>Slide 10</swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "PicSwiper",
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.swiper.swiperInstance;
    }
  }
};
</script>

<style lang="scss" scoped>
.swiper {
  height: 60%;
  width: 100%;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    font-size: 30;
    background-color: gray;
  }
}
</style>
