
<template>
  <swiper class="swiper">
    <swiper-slide><ProfileCard></ProfileCard></swiper-slide>
  </swiper>
</template>

<script>
import ProfileCard from './ProfileCard';
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "PeopleSwiper",
  components: {
    Swiper,
    SwiperSlide,
    ProfileCard
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        pagination: {
          el: ".swiper-pagination"
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.swiper {
  height: 100%;
  width: 100%;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    font-size: 30;
    // background-color: blue;
  }
}
</style>
