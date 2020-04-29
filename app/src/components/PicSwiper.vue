
<template>
  <swiper class="swiper" ref="swiper" :options="swiperOption">
    <swiper-slide v-if="!pics.length">
      <v-img
        height="100%"
        width="100%"
        :src="'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'"
      ></v-img>
    </swiper-slide>
    <swiper-slide v-else v-for="img in pics" :key="img.id">
      <img :src="img.pic" height="100%" width="100%" />
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
    recId: String,
    pics: Array
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
    }
  },
  watch: {
    // recId: function(newId, oldId) {
    //   newId !== oldId && this.swiper && this.swiper.slideTo(0, 0, false);
    // },
    pics: function() {
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
