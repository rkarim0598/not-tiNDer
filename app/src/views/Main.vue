<template>
  <v-container v-if="!matchMode" class="main-container" fill-height fluid align-center>
    <v-row dense>
      <v-col cols="12">
        <v-col>
          <div light class="headline white--text">Recommended for you</div>
        </v-col>
        <v-card color="#385f73" dark @click="matchMode = true">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline" v-text="'Rayyan Karim'"></v-card-title>
              <v-card-text v-text="'Personality: ISFP'"></v-card-text>
              <v-card-subtitle v-text="'Sorin College'"></v-card-subtitle>
            </div>
            <v-avatar class="ma-3" size="125" tile>
              <v-img
                :src="'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'"
              ></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div light class="headline white--text">Events for you</div>
        <v-card color="#385f73" dark>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline" v-text="'here be a title'"></v-card-title>
              <v-card-subtitle v-text="'here be sub'"></v-card-subtitle>
            </div>
            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="'../assets/hand-holding.jpg'"></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container class="main-container" v-else fill-height fluid align-center>
    <PeopleSwiper @swiped="handleSwiped"></PeopleSwiper>
  </v-container>
</template>

<script>
import PeopleSwiper from "../components/PeopleSwiper";

export default {
  name: "Main",
  components: {
    PeopleSwiper
  },
  data: function() {
    return {
      matchMode: false
    };
  },
  methods: {
    handleSwiped: function(val) {
      // can send request to database for match/block here
      // also need to update person being viewed
      console.log(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0) linear-gradient(rgb(111, 0, 0), rgb(32, 1, 34))
    repeat scroll 0% 0%;
}
</style>