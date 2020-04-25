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
    <PeopleSwiper :recId="'rkarim@nd.edu'" :rec="recs['rkarim@nd.edu']" @swiped="handleSwiped"></PeopleSwiper>
    <v-layout class="back-container" align-end justify-end>
      <a @click="matchMode = false" icon>
        <v-icon color="blue">mdi-keyboard-backspace</v-icon>Back
      </a>
    </v-layout>
  </v-container>
</template>

<script>
import PeopleSwiper from "../components/PeopleSwiper";
import pic from "../assets/hand-holding.jpg";

export default {
  name: "Main",
  components: {
    PeopleSwiper
  },
  data: function() {
    return {
      matchMode: false,
      recs: {
        "rkarim@nd.edu": {
          name: "Rayyan Karim",
          personality: "ESFP",
          nickname: "R-Sizzle",
          residence: "Sorin College",
          bio:
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id dolor id risus mattis hendrerit ac convallis ligula. Nulla non nisl elit. Mauris in neque nec dui porttitor sollicitudin vel at libero. Donec lobortis at mauris eget rutrum. Mauris sollicitudin, felis eget elementum facilisis, nulla ipsum tempor nisl, sed convallis eros diam sed elit. Sed in tempor leo. Quisque eget imperdiet in. ",
          pics: [
            { id: 0, pic },
            { id: 1, pic },
            { id: 2, pic },
            { id: 3, pic },
            { id: 4, pic }
          ]
        }
      }
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

.back-container {
  height: 1px !important;
}
</style>