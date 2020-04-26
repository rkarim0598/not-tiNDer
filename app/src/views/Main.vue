<template>
  <v-container v-if="!matchMode" class="main-container" fill-height fluid align-center>
    <v-row v-if="noRecs" dense>
      <v-col>
        <p class="text-center headline white--text">Check back later for new recommendations!</p>
      </v-col>
    </v-row>
    <v-row v-if="!noRecs" dense>
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
    <v-row v-if="!noRecs">
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
    <PeopleSwiper v-if="!noRecs" :rec="currentRec" @swiped="handleSwiped"></PeopleSwiper>
    <div v-else light class="no-more headline white--text">No more recs</div>
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
      current: 0,
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
        },
        "jmeyer5@nd.edu": {
          name: "Jack Meyer",
          personality: "IJTP",
          nickname: "J-Dogg",
          residence: "Dunne Hall",
          bio:
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id dolor id risus mattis hendrerit ac convallis ligula. Nulla non nisl elit. Mauris in neque nec dui porttitor sollicitudin vel at libero. Donec lobortis at mauris eget rutrum. Mauris sollicitudin, felis eget elementum facilisis, nulla ipsum tempor nisl, sed convallis eros diam sed elit. Sed in tempor leo. Quisque eget imperdiet in. ",
          pics: [
            {
              id: 0,
              pic:
                "https://media-exp1.licdn.com/dms/image/C4E03AQEHdtxsrh1bsA/profile-displayphoto-shrink_200_200/0?e=1593648000&v=beta&t=MD56mHp-S0lqSx9luJW4TEoyDxvCoSbQ5qwXi7VYaI8"
            },
            { id: 1, pic },
            {
              id: 2,
              pic:
                "https://media-exp1.licdn.com/dms/image/C4E03AQEHdtxsrh1bsA/profile-displayphoto-shrink_200_200/0?e=1593648000&v=beta&t=MD56mHp-S0lqSx9luJW4TEoyDxvCoSbQ5qwXi7VYaI8"
            },
            { id: 3, pic },
            {
              id: 4,
              pic:
                "https://media-exp1.licdn.com/dms/image/C4E03AQEHdtxsrh1bsA/profile-displayphoto-shrink_200_200/0?e=1593648000&v=beta&t=MD56mHp-S0lqSx9luJW4TEoyDxvCoSbQ5qwXi7VYaI8"
            }
          ]
        }
      }
    };
  },
  methods: {
    handleSwiped: function(val) {
      // can send request to database for match/block here
      // also need to update person being viewed
      console.log(`Liked ${this.currentRec.id}: ${val}`);
      this.current++;
    }
  },
  computed: {
    currentRec: function() {
      let id = Object.keys(this.recs)[this.current];

      return { id, data: this.recs[id] };
    },
    noRecs: function() {
      return this.current >= Object.keys(this.recs).length;
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

.no-more {
  display: flex;
  height: 99%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.back-container {
  height: 1px !important;
}
</style>