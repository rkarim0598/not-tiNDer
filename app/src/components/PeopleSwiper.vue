
<template>
  <swiper class="swiper" ref="people-swiper" :options="swiperOption">
    <swiper-slide>
      <div class="headline white--text">Liked!</div>
    </swiper-slide>
    <swiper-slide>
      <v-layout column fill-height fill-width align-center class="profile-container">
        <ProfileCard></ProfileCard>
        <v-layout fill-width justify-space-evenly>
          <v-btn @click="() => performLike(true)">Like</v-btn>
          <v-btn @click="() => performLike(false)">Pass</v-btn>
        </v-layout>
      </v-layout>
    </swiper-slide>
    <swiper-slide>
      <div class="headline white--text">Passed</div>
    </swiper-slide>
  </swiper>
</template>

<script>
import ProfileCard from "./ProfileCard";
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
  },
  mounted: function() {
    // start at second slide
    this.swiper.slideTo(1, 0, false);
    
    // add listener for slide change
    let vue = this;
    this.swiper.eventsListeners.slideChangeTransitionEnd = [
      function bindSwiperEvents() {
        vue.onSwipe(vue.swiper.realIndex);
      }
    ];
  },
  methods: {
    onSwipe: function(val) {
      // based on the currently viewed slide, take appropriate action
      if (val === 1) {
        return;
      } else if (val === 0) {
        this.$emit("swiped", true); // emit value to parent
      } else if (val === 2) {
        this.$emit("swiped", false);
      }

      // slide back to first person slide
      const vue = this;
      setTimeout(function() {
        vue.swiper.slideTo(1, 450, false);
      }, 300);
    },
    performLike: function(isLike) {
      // slide to appropriate slide (0 for like, 2 for pass)
      this.swiper.slideTo(isLike ? 0 : 2, 350, false);

      // emit to parent
      const vue = this;
      setTimeout(function() {
        vue.onSwipe(isLike ? 0 : 2)
      }, 500);
    }
  },
  computed: {
    swiper() {
      return this.$refs["people-swiper"].swiperInstance;
    }
  }
};
</script>

<style lang="scss" scoped>
.swiper {
  height: 80%;
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

.profile-container {
  margin: 0 0;
}
</style>
