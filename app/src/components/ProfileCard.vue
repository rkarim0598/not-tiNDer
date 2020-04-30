
<template>
  <v-container fill-height align-center fluid class="card-container">
    <v-card dark class="pics-container">
      <PicSwiper :recId="rec.user_id" :pics="rec.pics || []"></PicSwiper>
      <v-layout class="bottom-card-container" align-start justify-start column>
        <v-card-title class="all-text name-container headline white--text" v-text="`${rec.first_name} ${rec.last_name}`"></v-card-title>
        <v-card-text
          v-if="rec.residence_name"
          class="text-left gray--text font-italic font-weight-light"
        >{{ rec.residence_name }}</v-card-text>
        <div class="text-container column-setter">
          <div class="column-setter bottom-padding" v-if="rec.nickname">
            <span class="text-left all-text white--text font-weight-regular">Nickname</span>
            <span
              class="text-left all-text white--text bio-text font-weight-light"
            >{{ rec.nickname }}</span>
          </div>
          <span class="text-left font-weight-regular">Bio</span>
          <span class="bottom-padding text-left all-text white--text bio-text font-weight-light">{{ rec.biography }}</span>
        </div>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import PicSwiper from "./PicSwiper";

export default {
  name: "ProfileCard",
  components: {
    PicSwiper
  },
  props: {
    rec: Object
  },
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
.card-container {
  margin: 0 0;
}

.bottom-card-container {
  height: 50%;
}

.all-text {
  padding-bottom: 0px;
}

.no-top-padding {
  padding-top: 0px;
}

.bottom-padding {
  padding-bottom: 10px;
}

.pics-container {
  height: 100%;
  width: 80%;
  margin: auto auto;
  max-height: 600px;
  max-width: 450px;
}

.text-container {
  max-height: 18vh;
  white-space: pre-line;
  text-align: left;
  overflow: auto;
  padding-left: 16px;
}

.column-setter {
  display: flex;
  flex-direction: column;
}

// .bio-text {
//   white-space: pre-line;
//   text-align: left;
// }
</style>
