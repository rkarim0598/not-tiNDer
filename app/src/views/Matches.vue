<template>
  <v-container
    dark
    fill-height
    fluid
    align-center
    justify-space-between
    class="messages-container flex-column"
  >
    <v-container dark class="match-list-container">
      <div class="pb-2">
        <div class="white--text display-1">Your Matches</div>
        <v-divider dark></v-divider>
      </div>
      <v-tabs dark v-model="tab" icons-and-text>
        <v-tab>
          Two way matches
          <v-icon>mdi-account-switch</v-icon>
        </v-tab>
        <v-tab>
          Liked by
          <v-icon>mdi-account-arrow-left</v-icon>
        </v-tab>
        <v-tab>
          You like
          <v-icon>mdi-account-arrow-right</v-icon>
        </v-tab>
      </v-tabs>
      <v-tabs-items dark v-model="tab" style="width: 100%; background-color: transparent">
        <v-tab-item>
          <match-list :query="$apollo.queries.matches" :matches="matches"></match-list>
        </v-tab-item>
        <v-tab-item>
          <match-list :query="$apollo.queries.withYou" :matches="withYou"></match-list>
        </v-tab-item>
        <v-tab-item>
          <match-list :query="$apollo.queries.fromYou" :matches="fromYou"></match-list>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
    <bottom-nav :data="navData"></bottom-nav>
    
    <error-snackbar :error="error"></error-snackbar>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import BottomNav from "../components/BottomNav";
import MatchList from "../components/MatchList";
import ErrorSnackbar from "../components/ErrorSnackbar"

export default {
  name: "Matches",
  components: {
    BottomNav,
    MatchList,
    ErrorSnackbar
  },
  data: function() {
    return {
      matches: undefined,
      error: undefined,
      tab: 0,
      navData: {
        activeIndex: 1,
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
              console.log("clicked");
            }
          },
          {
            title: "Profile",
            icon: "mdi-account-circle",
            onClick: () => {
              this.$router.push("profile");
            }
          }
        ]
      }
    };
  },
  methods: {
    handleNotLoggedIn: function(error) {
      try {
        let message =
          error["networkError"] &&
          error["networkError"]["result"]["errors"][0].message;
        if (message === "Not logged in") {
          this.$router.push("login");
        } else {
          this.error = message;
          return true;
        }
      } catch (error) {
        return true;
      }
    }
  },
  apollo: {
    matches: {
      query: gql`
        query {
          matches: findMatches {
            match_id
            other_user {
              user_id
              first_name
              last_name
            }
            latest_message {
              message_id
              content
              timestamp
              sender {
                user_id
              }
            }
          }
        }
      `,
      variables: function() {
        return {
          id: this.$route.params.otherId
        };
      },
      error: function(err) {
        this.error = err.message;
        this.handleNotLoggedIn(err);
      },
      subscribeToMore: {
        document: gql`
          subscription match {
            match {
              match_id
              other_user {
                user_id
                first_name
                last_name
              }
              messages {
                message_id
                content
                timestamp
                sender {
                  user_id
                }
              }
            }
          }
        `,
        updateQuery: function({ }, { }) {
          this.$apollo.queries.matches.refresh();
        },
        error: function(err) {
          this.error = err.message;
          this.handleNotLoggedIn(err);
        }
      }
    },
    withYou: {
      query: gql`
        query {
          withYou: findOneWayMatchesWithUser {
            match_id
            other_user {
              user_id
              first_name
              last_name
            }
            latest_message {
              message_id
              content
              timestamp
              sender {
                user_id
              }
            }
          }
        }
      `,
      variables: function() {
        return {
          id: this.$route.params.otherId
        };
      },
      error: function(err) {
        this.error = err.message;
        this.handleNotLoggedIn(err);
      },
      subscribeToMore: {
        document: gql`
          subscription match {
            match {
              match_id
              other_user {
                user_id
                first_name
                last_name
              }
              messages {
                message_id
                content
                timestamp
                sender {
                  user_id
                }
              }
            }
          }
        `,
        updateQuery: function({ }, { }) {
          this.$apollo.queries.withYou.refresh();
        },
        error: function(err) {
          this.error = err.message;
          this.handleNotLoggedIn(err);
        }
      }
    },
    fromYou: {
      query: gql`
        query {
          fromYou: findUserOneWayMatches {
            match_id
            other_user {
              user_id
              first_name
              last_name
            }
            latest_message {
              message_id
              content
              timestamp
              sender {
                user_id
              }
            }
          }
        }
      `,
      variables: function() {
        return {
          id: this.$route.params.otherId
        };
      },
      error: function(err) {
        this.error = err.message;
        this.handleNotLoggedIn(err);
      },
      subscribeToMore: {
        document: gql`
          subscription match {
            match {
              match_id
              other_user {
                user_id
                first_name
                last_name
              }
              messages {
                message_id
                content
                timestamp
                sender {
                  user_id
                }
              }
            }
          }
        `,
        updateQuery: function({ }, { }) {
          this.$apollo.queries.fromYou.refresh();
        },
        error: function(err) {
          this.error = err.message;
          this.handleNotLoggedIn(err);
        }
      }
    }
  },
  watch: {
    error: function(value) {
      value.length && setTimeout(() => this.error, 1500);
    }
  }
};
</script>

<style scoped lang="scss">
.messages-container {
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0) linear-gradient(rgb(111, 0, 0), rgb(32, 1, 34))
    repeat scroll 0% 0%;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;

  .match-list-container {
    padding-left: 24px;
    padding-right: 24px;
    max-width: 800px;
  }
}

.v-form {
  height: 80%;
}
</style>
