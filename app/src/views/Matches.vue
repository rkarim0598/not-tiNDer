<template>
  <v-container dark fill-height fluid align-center justify-space-between class="messages-container flex-column">
    <v-container dark class="match-list-container">
      <div class="pb-2">
        <div class="white--text display-1">Your Matches</div>
        <v-divider dark></v-divider>
      </div>
      <v-tabs dark v-model="tab" icons-and-text>
        <v-tab>Two way matches<v-icon>mdi-account-switch</v-icon></v-tab>
        <v-tab>People who like you<v-icon>mdi-account-arrow-left</v-icon></v-tab>
        <v-tab>People who you like<v-icon>mdi-account-arrow-right</v-icon></v-tab>
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
    <v-snackbar color="error" bottom :value="error ? 'visible' : undefined">
      <div class="text-center" style="background-color: transparent">{{error}}</div>
    </v-snackbar>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import BottomNav from "../components/BottomNav";
import MatchList from "../components/MatchList";

export default {
  name: "Matches",
  components: {
    BottomNav,
    MatchList
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
              console.log("clicked");
            }
          }
        ]
      }
    };
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
        updateQuery: function({ matches }, { subscriptionData }) {
          console.log(matches, subscriptionData);
          // TODO match.messages.push(subscriptionData.data.message);
        },
        error: function(err) {
          this.error = err.message;
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
        updateQuery: function({ matches }, { subscriptionData }) {
          console.log(matches, subscriptionData);
          // TODO match.messages.push(subscriptionData.data.message);
        },
        error: function(err) {
          this.error = err.message;
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
        updateQuery: function({ matches }, { subscriptionData }) {
          console.log(matches, subscriptionData);
          // TODO match.messages.push(subscriptionData.data.message);
        },
        error: function(err) {
          this.error = err.message;
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
  }
}

.v-form {
  height: 80%;
}
</style>
