<template>
  <v-container class="messages-container" fill-height fluid align-center>
    <v-container fill-height fluid align-center justify-space-between class="flex-column">
      <v-container dark>
        <v-fade-transition hide-on-leave>
          <div v-if="matches">
            <div v-if="matches.length">
              <div v-for="(match, index) of matches" :key="match.match_id" class="px-2 py-1">
                <v-hover v-slot:default="{ hover }">
                  <v-card outlined @click="openMessages(match.other_user.user_id)" :elevation="hover ? 5 : 2">
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
                              <p class="caption mb-0">{{formatDate(index)}}</p>
                            </div>
                          </v-row>
                          <v-row class="d-flex">
                            <div>
                              <pre class="body-2 mb-0" :class="match.other_user.user_id == match.latest_message.user_id ? 'indigo--text font-weight-medium' : undefined">{{match.latest_message.content}}</pre>
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
                <v-row class="d-flex align-center">
                  <v-col xs="2" sm="1">
                    <v-skeleton-loader type="avatar">
                    </v-skeleton-loader>
                  </v-col>
                  <v-col xs="8" sm="10" class="py-1">
                    <v-card outlined>
                      <v-card-text>
                        <v-skeleton-loader :type="i%2 == 0 ? 'sentences' : 'text'">
                        </v-skeleton-loader>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </div>
            <div v-else>
              Could not load matches
            </div>
          </div>
        </v-fade-transition>
      </v-container>
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

export default {
  name: "Matches",
  data: function() {
    return {
      matches: undefined,
      error: undefined
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
