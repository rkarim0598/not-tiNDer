
<template>
  <swiper class="swiper" ref="people-swiper" :options="swiperOption">
    <swiper-slide>
      <div class="headline white--text">Liked!</div>
    </swiper-slide>
    <swiper-slide>
      <v-layout column fill-height align-center class="profile-container">
        <ProfileCard :rec="rec"></ProfileCard>
        <v-layout justify-space-around class="button-container">
          <v-btn fab dark @click="() => performLike(true)">
            <v-icon large color="red">mdi-heart</v-icon>
          </v-btn>
          <v-btn fab dark @click="() => performLike(null)">
            <v-icon class="rotate" large color="#FDFDF0">mdi-thumb-down</v-icon>
          </v-btn>
          <v-btn fab dark @click="() => performLike(false)">
            <v-icon large color="blue">mdi-thumb-down</v-icon>
          </v-btn>
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
  props: {
    rec: Object
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
    this.swiper.eventsListeners.slideChangeTransitionEnd = [
      () => {
        this.onSwipe(this.swiper.realIndex);
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
      // this and all other timeouts not getting triggered at all
      let vue = this;
      setTimeout(function() {
        vue.swiper.slideTo(1, 450, false);
      }, 300);

    },
    performLike: function(isLike) {
      if (isLike === null) {
        // just passing for now, not blocking
        this.$emit("swiped", null);
      } else {
        // slide to appropriate slide (0 for like, 2 for pass)
        this.swiper.slideTo(isLike ? 0 : 2, 350, false);

        // emit to parent by calling onSwipe
        let vue = this;
        setTimeout(function() {
          vue.onSwipe(isLike ? 0 : 2);
        }, 500);
      }
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
  height: 95%;
  width: 100%;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    font-size: 30;
  }
}

.profile-container {
  margin: 0 0;
}

.button-container {
  width: 80%;
  max-width: 400px;
}

.rotate {
  transform: rotate(90deg);
  /* Legacy vendor prefixes that you probably don't need... */
  /* Safari */
  -webkit-transform: rotate(90deg);

  /* Firefox */
  -moz-transform: rotate(90deg);

  /* IE */
  -ms-transform: rotate(90deg);

  /* Opera */
  -o-transform: rotate(90deg);

  /* Internet Explorer */
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
}
</style>
