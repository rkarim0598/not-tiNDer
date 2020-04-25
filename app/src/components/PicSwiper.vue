
<template>
  <div v-if="!pics.length" class="swiper">
    <v-img
      height="300"
      width="270"
      :src="'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'"
    ></v-img>
  </div>
  <swiper v-else class="swiper" ref="swiper" :options="swiperOption">
    <swiper-slide v-for="img in pics" :key="img.id">
      <v-img
        height="300"
        width="270"
        :src="img.pic"
        :lazy-src="'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'"
      ></v-img>
    </swiper-slide>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
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
  props: {
    pics: Array
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
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
  height: 50%;
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
