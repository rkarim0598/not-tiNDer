<template>
  <v-container v-if="!matchMode" class="main-container" fill-height fluid align-center>
    <v-row v-if="!recs.length" dense>
      <v-col>
        <p class="text-center headline white--text">Check back later for new recommendations!</p>
      </v-col>
    </v-row>
    <v-row v-if="recs.length" dense>
      <v-col cols="12">
        <v-col>
          <div light class="headline white--text">Recommended for you</div>
        </v-col>
        <v-card color="#385f73" dark @click="matchMode = true">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline" v-text="`${recs[0].first_name} ${recs[0].last_name}`"></v-card-title>
              <v-card-text v-text="`Personality: ${recs[0].personality_results || 'None'}`"></v-card-text>
              <v-card-subtitle v-text="recs[0].residence_name || 'Hobo'"></v-card-subtitle>
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
    <v-row v-if="recs.length">
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
    <PeopleSwiper v-if="recs.length" :rec="recs[0]" @swiped="handleSwiped"></PeopleSwiper>
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
import gql from "graphql-tag";

export default {
  name: "Main",
  components: {
    PeopleSwiper
  },
  data: function() {
    return {
      matchMode: false,
      recs: [],
      event_id: null,
      user_id: 'hgorbu@nd.edu'
    };
  },
  mounted: async function() {
    let res = await this.$apollo.query({
      query: gql`
        query findRecommendations($id: String) {
          findRecommendations(id: $id) {
            user_id
            first_name
            last_name
            gender_id
            bio
            nickname
            residence_name
            personality_results
          }
        }
      `,
      variables: {
        id: this.user_id, /* TODO change to get from cache */
      }
    });

    console.log(res.data.findRecommendations);

    this.recs = res.data.findRecommendations || [];
  },
  methods: {
    handleSwiped: async function(val) {
      let res;

      if (val === true) {
        res = await this.$apollo.mutate({
          mutation: gql`
            mutation($input: MatchInput) {
              createMatch(input: $input)
            }
          `,
          variables: {
            input: {
              user_id: this.user_id,
              other_user_id: this.recs[0].user_id,
              event_id: this.event_id
            }
          }
        });  
      } else if (val === false) {
        res = await this.$apollo.mutate({
          mutation: gql`
            mutation($input: MatchInput) {
              createBlock(input: $input)
            }
          `,
          variables: {
            input: {
              user_id: this.user_id,
              other_user_id: this.recs[0].user_id,
              event_id: this.event_id
            }
          }
        }); 
      } else {
        console.log('just passing for now');
      }

      console.log(res);

      this.recs.splice(0, 1);
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