<template>
  <v-container dark class="messages-container" fill-height fluid align-center>
    <v-container dark fill-height fluid align-center justify-space-between class="flex-column">
      <v-container dark>
        <div class="pb-2">
          <h2>Your Matches</h2>
          <v-divider></v-divider>
        </div>
        <v-fade-transition hide-on-leave>
          <div v-if="matches" class="flex-grow-1 overflow-y-auto" style="flex-basis: 0">
            <div v-if="matches.length">
              <div v-for="(match, index) of matches" :key="match.match_id" class="py-1">
                <v-hover v-slot:default="{ hover }">
                  <v-card outlined @click="openMessages(match.other_user.user_id)" :elevation="hover ? 5 : 2" class=mb-2>
                    <div class="px-5">
                      <v-row class="d-flex">
                        <v-col style="flex-basis: 1; flex-grow: 0">
                          <v-avatar color="indigo">
                            <img v-if="match.other_user.avatar" :src="'/photo/' + match.other_user.avatar">
                            <v-icon v-else dark>mdi-account-circle</v-icon>
                          </v-avatar>
                        </v-col>
                        <v-col class="py-1">
                          <v-row class="d-flex justify-space-between">
                            <div class="py-1">
                              <p class="mb-0">{{match.other_user.first_name}} {{match.other_user.last_name}}</p>
                            </div>
                            <div class="py-1">
                              <p v-if="match.latest_message" class="caption mb-0">{{formatDate(index)}}</p>
                            </div>
                          </v-row>
                          <v-row class="d-flex">
                            <div v-if="match.latest_message">
                              <pre class="body-2 mb-0" :class="match.other_user.user_id == match.latest_message.user_id ? 'indigo--text font-weight-medium' : undefined">{{match.latest_message.content}}</pre>
                            </div>
                            <div v-else>
                              <p class="mb-0">Get the conversation started!</p>
                            </div>
                            <!-- {{match.unread_messages}} -->
                          </v-row>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-hover>
              </div>
            </div>
            <div v-else>
              No matches yet, get swiping!
            </div>
          </div>
          <div v-else>
            <div v-if="$apollo.queries.matches.loading">
              <div v-for="i in 5" :key="i">
                <v-card outlined class="mb-2">
                  <div class="px-5">
                    <v-row class="d-flex">
                      <v-col style="flex-basis: 1; flex-grow: 0">
                        <v-skeleton-loader type="avatar">
                        </v-skeleton-loader>
                      </v-col>
                      <v-col class="py-1">
                        <v-row class="d-flex justify-space-between">
                          <div class="py-1">
                            <v-skeleton-loader type="text" style="min-width: 100px"></v-skeleton-loader>
                          </div>
                          <div class="py-1">
                            <v-skeleton-loader type="text" style="min-width: 50px"></v-skeleton-loader>
                          </div>
                        </v-row>
                        <v-row>
                          <v-skeleton-loader style="min-width: 100%" type="sentences">
                          </v-skeleton-loader>
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </div>
            </div>
            <div v-else>
              Could not load matches
            </div>
          </div>
        </v-fade-transition>
      </v-container>
      <bottom-nav :data="navData"></bottom-nav>
    </v-container>
  <v-snackbar color="error" bottom :value="error ? 'visible' : undefined">
    <div class="text-center" style="background-color: transparent">
      {{error}}
    </div>
  </v-snackbar>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import BottomNav from '../components/BottomNav';

export default {
  name: "Matches",
  components: {
    BottomNav
  },
  data: function() {
    return {
      matches: undefined,
      error: undefined,
      navData: {
        activeIndex: 1,
        tabs: [
          {
            title: "Explore",
            icon: "mdi-card-search",
            onClick: () => {
              this.$router.push('main');
            }
          },
          {
            title: "Matches",
            icon: "mdi-account-group",
            onClick: () => {
              console.log('clicked');
            }
          },
          {
            title: "Profile",
            icon: "mdi-account-circle",
            onClick: () => {
              console.log('clicked');
            }
          }
        ]
      }
    };
  },
  methods: {
    formatDate: function(index) {
      const date = new Date(Number(this.matches[index].latest_message.timestamp));
      if(new Date().toLocaleDateString() == date.toLocaleDateString()) {
        return date.toLocaleTimeString();
      }
      return date.toLocaleString();
    },
    openMessages: function(id) {
      this.$router.push('messages/' + id);
    }
  },
  apollo: {
    matches: {
      query: gql`query {
        matches: findMatches {
          match_id,
          other_user {
            user_id,
            first_name,
            last_name
          },
          latest_message {
            message_id,
            content,
            timestamp,
            sender {
              user_id
            }
          }
        }
      }`,
      variables: function(){
        return {
          id: this.$route.params.otherId,
        };
      },
      error: function(err) {
        this.error = err.message;
      },
      subscribeToMore: {
        document: gql`subscription match {
          match {
            match_id,
            other_user {
              user_id,
              first_name,
              last_name
            },
            messages {
              message_id,
              content,
              timestamp,
              sender {
                user_id
              }
            }
          }
        }`,
        updateQuery: function({matches}, { subscriptionData }) {
          console.log(matches, subscriptionData);
          // TODO match.messages.push(subscriptionData.data.message);
        },
        error: function(err) {
          this.error = err.message;
        },
      }
    }
  }
}
</script>

<style scoped lang="scss">
.messages-container {
  display: flex;
  justify-content: center;
  background: linear-gradient(darkblue, black);
}
.messages-container div {
  background: white;
}

.v-form {
  height: 80%;
}
</style>
