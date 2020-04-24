
<template>
  <v-container fill-height align-center fluid>
    <v-card dark class="pics-container">
      <PicSwiper></PicSwiper>
      <v-layout align-start justify-start column>
        <v-card-title class="headline white--text" v-text="'Rayyan Karim'"></v-card-title>
        <v-card-subtitle class="white--text" v-text="'Nickname'"></v-card-subtitle>
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
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.pics-container {
  height: 80%;
	width: 100%;
	max-height: 800px;
	max-width: 450px;
}
</style>
