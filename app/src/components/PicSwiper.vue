
<template>
  <swiper class="swiper" ref="swiper" :options="swiperOption" :style="swiperStyle">
    <swiper-slide v-if="!photos || !photos.length">
      <v-icon style="font-size: 10em" dark>mdi-account-circle</v-icon>
    </swiper-slide>
    <swiper-slide v-else v-for="img in photos" :key="img">
      <img :src="'/photo/' + img" height="100%" width="100%" />
    </swiper-slide>
    <div v-if="photos && photos.length > 1" class="swiper-button-prev" slot="button-prev"></div>
    <div v-if="photos && photos.length > 1" class="swiper-button-next" slot="button-next"></div>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "photoswiper",
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    recId: String,
    photos: Array,
    height: String,
    width: String
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        loop: true,
        preloadImages: true,
        lazy: false,
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
    },
    swiperStyle() {
      let str = this.height ? `height: ${this.height};` : '';
      str += this.width ? `width: ${this.width}` : '';
      return str;
    }
  },
  watch: {
    // recId: function(newId, oldId) {
    //   newId !== oldId && this.swiper && this.swiper.slideTo(0, 0, false);
    // },
    photos: function() {
      this.swiper?.slideTo(0, 0, false);
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
