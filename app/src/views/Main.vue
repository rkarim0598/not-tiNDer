<template>
  <v-container v-if="!matchMode" class="main-container" fill-height fluid align-center>
    <v-row v-if="!recs[event_id].length" dense>
      <v-col>
        <p
          v-if="!defaultLoading"
          class="text-center headline white--text"
        >Check back later for new recommendations!</p>
        <v-skeleton-loader
          v-else
          dark
          type="article, list-item-two-line"
          min-height="100%"
          min-width="80%"
          class="skeleton"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row v-if="recs[event_id].length" dense>
      <v-col cols="12">
        <div light class="headline white--text">Recommended for you</div>
        <v-card color="#385f73" dark @click="matchMode = true">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title
                class="headline"
                v-text="`${recs[event_id][0].first_name} ${recs[event_id][0].last_name}`"
              ></v-card-title>
              <v-card-text v-text="`Personality: ${recs[event_id][0].personality_id || 'None'}`"></v-card-text>
              <v-card-subtitle v-text="recs[event_id][0].residence_name || 'Hobo Hall'"></v-card-subtitle>
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
    <v-row v-if="defaultLoading || events.length">
      <v-col cols="12">
        <div light class="headline white--text">Events for you</div>
        <v-card
          v-if="!defaultLoading"
          color="#385f73"
          @click="matchForEvent(events[eventIndex].event_id)"
          dark
        >
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline" v-text="events[eventIndex].event_name"></v-card-title>
              <v-card-subtitle v-text="formattedDate(events[eventIndex].sdate)"></v-card-subtitle>
              <v-card-subtitle class="white--text" v-text="events[eventIndex].location"></v-card-subtitle>
              <v-card-subtitle class="white--text" v-text="events[eventIndex].event_description"></v-card-subtitle>
            </div>
          </div>
        </v-card>
        <v-skeleton-loader
          v-else
          dark
          type="article, list-item-three-line"
          min-height="100%"
          min-width="80%"
          class="skeleton"
        ></v-skeleton-loader>
        <div class="button-container">
          <v-btn outlined dark @click="eventIndex--" :disabled="eventIndex === 0">Last</v-btn>
          <v-btn
            outlined
            dark
            @click="eventIndex++"
            :disabled="eventIndex === events.length - 1"
          >Next</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <div light class="headline white--text text-center">No events right now</div>
      </v-col>
    </v-row>
  </v-container>
  <v-container class="main-container" v-else fill-height fluid align-center>
    <PeopleSwiper
      v-if="!loading && recs[this.event_id].length"
      :rec="recs[this.event_id][0]"
      @swiped="handleSwiped"
    ></PeopleSwiper>
    <div
      v-else-if="!loading && !recs[this.event_id].length"
      light
      class="no-more headline white--text"
    >No more recs</div>
    <div v-else-if="loading" class="skeleton-container">
      <v-skeleton-loader
        dark
        type="card-avatar, article, actions"
        min-height="80%"
        min-width="80%"
        class="max-auto skeleton"
      ></v-skeleton-loader>
    </div>
    <v-layout class="back-container" align-end justify-end>
      <a @click="exitMatchMode" icon>
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
      recs: { default: [] },
      event_id: "default",
      events: [],
      eventIndex: 0,
      loading: false,
      defaultLoading: true
    };
  },
  mounted: async function() {
    // fetch events
    this.defaultLoading = true;
    this.events = await this.getEvents();

    // fetch recs, ignoring events
    this.recs.default = await this.getRecommendations(null);
    this.defaultLoading = false;

    // populate possible events
    for (let key in this.events) {
      this.recs[key] = [];
    }
  },
  methods: {
    formattedDate: function(timestamp) {
      return new Date(Number(timestamp)).toLocaleString();
    },
    exitMatchMode: function() {
      this.event_id = "default";
      this.matchMode = false;
    },
    matchForEvent: async function(event_id) {
      this.event_id = event_id;
      this.matchMode = true;

      this.loading = true;
      this.recs[event_id] = await this.getRecommendations(event_id);
      this.loading = false;
    },
    getRecommendations: async function(event_id) {
      let eid = event_id === "default" ? null : event_id;

      try {
        let res = await this.$apollo.query({
          query: gql`
            query findRecommendations($event_id: Int) {
              findRecommendations(event_id: $event_id) {
                user_id
                first_name
                last_name
                gender_id
                bio
                nickname
                residence_name
                personality_id
              }
            }
          `,
          variables: {
            event_id: eid
          }
        });
        console.log(res);
        return res.data.findRecommendations || [];
      } catch (error) {
        console.log(error);
        if (
          error["networkError"]["result"]["errors"][0].message ===
          "Not logged in"
        ) {
          this.$router.push("login");
        } else {
          alert("Something went wrong, please refresh and try again");
          return [];
        }
      }
    },
    getEvents: async function() {
      try {
        let res = await this.$apollo.query({
          query: gql`
            query findEvents {
              findEvents {
                event_id
                event_name
                user_id
                location
                sdate
                event_description
              }
            }
          `
        });
        return res.data.findEvents || [];
      } catch (error) {
        console.log(error);
        alert("Something went wrong, please refresh and try again.");
        return [];
      }
    },
    handleSwiped: async function(val) {
      let res;
      let eid = this.event_id === "default" ? null : this.event_id;
      
      if (val === true) {
        try {
          res = await this.$apollo.mutate({
            mutation: gql`
              mutation($input: MatchInput) {
                createMatch(input: $input)
              }
            `,
            variables: {
              input: {
                other_user_id: this.recs[this.event_id][0].user_id,
                event_id: eid
              }
            }
          });
          console.log(res);
        } catch (error) {
          console.log("error");
          alert("Something went wrong, please refresh");
        }
      } else if (val === false) {
        try {
          res = await this.$apollo.mutate({
            mutation: gql`
              mutation($input: MatchInput) {
                createBlock(input: $input)
              }
            `,
            variables: {
              input: {
                other_user_id: this.recs[this.event_id][0].user_id,
                event_id: eid
              }
            }
          });
          console.log(res);
        } catch (error) {
          console.log(error);
          alert("Something went wrong, please refresh");
        }
      } else {
        console.log("just passing for now");
      }

      this.recs[this.event_id].splice(0, 1);
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

.button-container {
  padding-top: 5px;
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}

.skeleton-container {
  width: 100%;
  height: 99%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>