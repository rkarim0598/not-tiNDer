<template>
  <v-container class="profile-page-container" fill-height fluid align-center justify-space-between>
    <v-container class="profile-container" fill-height fluid align-center justify-space-between>
        <div class="white--text">hi</div>
    </v-container>
    <bottom-nav :data="navData"></bottom-nav>
  </v-container>
</template>

<script>
import gql from 'graphql-tag';
import BottomNav from "../components/BottomNav";

export default {
  name: "Profile",
  components: {
    // PicSwiper,
    BottomNav
  },
  data: function() {
    return {
      error: '',
      user: null,
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
  apollo: {
    user: {
      query: gql`
        query {
          matches: findUser {
            first_name
            last_name
            photos
            biography
            nickname
            residence {
              name
            }
            avatar
            gender_interests {
                name
            }
            personality_id
          }
        }
      `,
      error: function(err) {
        this.error = err.message;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-page-container {
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  background: rgba(0, 0, 0, 0) linear-gradient(rgb(111, 0, 0), rgb(32, 1, 34))
    repeat scroll 0% 0%;
}

.profile-container {
    padding-left: 24px;
    padding-right: 24px;
}
</style>