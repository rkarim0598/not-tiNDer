<template>
  <v-container class="profile-page-container" fill-height fluid align-center justify-space-between>
    <v-container
      v-if="user"
      class="profile-container"
      fill-height
      fluid
      align-center
      justify-space-between
    >
      <v-row>
        <v-col>
          <div class="text--center white--text display-3">Profile</div>
          <v-divider dark></v-divider>
          <v-btn text color="primary" @click="logOut">Log Out</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="white--text title">Gallery</span>
          <v-divider dark></v-divider>
          <pic-swiper :width="'100%'" :height="'90%'" :recId="user.user_id" :photos="user.photos"></pic-swiper>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="white--text title">Gender</span>
          <v-divider dark></v-divider>
          <span class="white--text subtitle">{{ user.gender.name }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="white--text title">Nickname</span>
          <v-divider dark></v-divider>
          <span class="white--text subtitle">{{ user.nickname }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="white--text title">Residence</span>
          <v-divider dark></v-divider>
          <span class="white--text subtitle">{{ user.residence.name }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="white--text title">Biography</span>
          <v-divider dark></v-divider>
          <span class="white--text subtitle">{{ user.biography }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="white--text title">Personality</span>
          <v-divider dark></v-divider>
          <span class="white--text subtitle">{{ user.personality_id }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="white--text title">Interested In</span>
          <v-divider dark></v-divider>
          <span class="white--text subtitle">{{ user.gender_interest.map(g => g.name).join(', ') }}</span>
        </v-col>
      </v-row>
            <v-row>
        <v-col>
          <span class="white--text title">Seriousness</span>
          <v-divider dark></v-divider>
          <span class="white--text subtitle">{{ user.seriousness }}</span>
        </v-col>
      </v-row>
    </v-container>
    <v-container
      v-else-if="$apollo.queries.user.loading"
      class="profile-container"
      fill-height
      fluid
      align-center
      justify-space-between
    >
      <v-row>
        <v-col>
          <v-skeleton-loader type="image"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row v-for="i in 3" :key="i">
        <v-col>
          <v-skeleton-loader type="heading"></v-skeleton-loader>
          <v-skeleton-loader type="text"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
    <v-container
      v-else
      class="profile-container"
      fill-height
      fluid
      align-center
      justify-space-between
    >
      <v-row>
        <v-col>
          <div class="text-center white--text title">Unable to load profile</div>
        </v-col>
      </v-row>
    </v-container>
    <bottom-nav :data="navData"></bottom-nav>
    <error-snackbar :error="error"></error-snackbar>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import BottomNav from "../components/BottomNav";
import PicSwiper from "../components/PicSwiper";
import mixin from "../mixin";

export default {
  name: "Profile",
  components: {
    PicSwiper,
    BottomNav
  },
  mixins: [mixin],
  data: function() {
    return {
      error: "",
      user: undefined,
      navData: {
        activeIndex: 2,
        tabs: [
          {
            title: "Explore",
            icon: "mdi-card-search",
            onClick: () => {
              this.$router.push("main");
            }
          },
          {
            title: "Matches",
            icon: "mdi-account-group",
            onClick: () => {
              this.$router.push("matches");
            }
          },
          {
            title: "Profile",
            icon: "mdi-account-circle",
            onClick: () => {}
          }
        ]
      }
    };
  },
  methods: {
    logOut: async function() {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation logout {
              logout {
                failure
              }
            }
          `
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.$router.push("/");
      }
    }
  },
  apollo: {
    user: {
      query: gql`
        query {
          user: findUser {
            user_id
            first_name
            last_name
            photos
            biography
            nickname
            gender {
              gender_id
              name
            }
            gender_interest {
              gender_id
              name
            }
            residence {
              name
            }
            personality_id
            seriousness
          }
        }
      `,
      error: function(err) {
        this.error = err.message;
      }
    }
  },
  watch: {
    error: function(value) {
      value && setTimeout(() => (this.error = ""), 1500);
      if (this.checkLoggedIn(value)) this.$router.push("login");
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-page-container {
  padding: 0;
  background: rgba(0, 0, 0, 0) linear-gradient(rgb(111, 0, 0), rgb(32, 1, 34))
    repeat scroll 0% 0%;
}

.profile-container {
  padding-left: 24px;
  padding-right: 24px;
  max-height: 88vh;
  max-width: 800px;
  overflow-y: scroll;
}
</style>