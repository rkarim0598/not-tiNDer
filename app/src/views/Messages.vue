<template>
  <v-container class="messages-container" fill-height fluid align-center>
    <v-container fill-height fluid align-center justify-space-between>
      <v-container dark fill-height class="flex-column" style="width:100%; height: 80%">
        <div class="pb-2" style="width:100%">
          <h2 v-if="match">{{match.other_user.first_name}} {{match.other_user.last_name}}</h2>
          <h2 v-else style="max-width: 100px"><v-skeleton-loader type="text"></v-skeleton-loader></h2>
          <v-divider></v-divider>
        </div>
        <div class="flex-grow-1" style="width:100%; overflow-y: scroll; flex-basis: 0">
          <v-fade-transition hide-on-leave>
            <div v-if="match" class="px-2">
              <div v-if="match.messages.length">
                <div v-for="(message, index) of match.messages" :key="message.message_id">
                  <p class="caption text-center mb-0">
                    {{formatDate(index)}}
                  </p>
                  <v-row class="d-flex align-center">
                    <v-col xs="2" sm="1">
                      <v-avatar color="indigo" v-if="message.sender.user_id != user.user_id">
                        <v-icon dark>mdi-account-circle</v-icon>
                      </v-avatar>
                    </v-col>
                    <v-col xs="8" sm="10" class="py-1">
                      <v-card outlined :color="message.sender.user_id != user.user_id ? 'indigo' : undefined">
                        <v-card-text>
                          <pre class="body-2">{{message.content}}</pre>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col xs="2" sm="1">
                      <v-avatar color="grey" v-if="message.sender.user_id == user.user_id">
                        <v-icon dark>mdi-account-circle</v-icon>
                      </v-avatar>
                    </v-col>
                  </v-row>
                </div>
              </div>
              <div v-else>
                No messages here yet, why don't you strike up a conversation?
              </div>
            </div>
            <div v-else class="px-2">
              <div v-if="$apollo.queries.match.loading">
                <div v-for="i in 5" :key="i">
                  <v-row class="d-flex align-center">
                    <v-col xs="2" sm="1">
                      <v-skeleton-loader v-if="i%3 == 1" type="avatar">
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
                    <v-col xs="2" sm="1">
                      <v-skeleton-loader v-if="i%3 != 1" type="avatar">
                      </v-skeleton-loader>
                    </v-col>
                  </v-row>
                </div>
              </div>
              <div v-else>
                Could not load messages
              </div>
            </div>
          </v-fade-transition>
        </div>
      </v-container>
      <v-container style="flex-grow-0">
        <v-textarea outlined :disabled="!match" v-model="draftMessage" @keypress="handleKeypress" :append-icon="draftMessage ? 'mdi-send' : undefined" @click:append="sendMessage" rows="1" label="Enter Message" auto-grow>
        </v-textarea>
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
  name: "Messages",
  data: function() {
    return {
      user: undefined,
      match: undefined,
      draftMessage: '',
      error: undefined
    };
  },
  methods: {
    formatDate: function(index) {
      const date = new Date(Number(this.match.messages[index].timestamp));
      if(index == 0) {
        return date.toLocaleString();
      }
      const previous = new Date(Number(this.match.messages[index - 1].timestamp));
      if(date.valueOf() - previous.valueOf() < 5 * 60 * 1000) {
        return;
      }
      if(previous.toLocaleDateString() == date.toLocaleDateString()) {
        return date.toLocaleTimeString();
      }
      return date.toLocaleString();
    },
    handleKeypress: function(e) {
      if(e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    },
    sendMessage: async function() {
      if(!this.draftMessage) {
        return;
      }
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation($input: MessageInput) {
              createMessage(input: $input) {
                message_id
              }
            }
          `,
          variables: {
            input: {
              receiver_id: this.$route.params.otherId,
              content: this.draftMessage,
            }
          }
        });
      } catch (err) {
        this.error = err.message;
        return;
      }
      this.draftMessage = '';
    }
  },
  watch: {
    $route: function(to) {
      this.$apollo.queries.match.setVariables({
        id: to.params.otherId
      });
    }
  },
  apollo: {
    user: {
      query: gql`query {
        user: findUser {
          user_id,
          nickname
        }
      }`,
      error: function(err) {
        this.error = err.message;
      }
    },
    match: {
      query: gql`query ($id: String!){
        match: findMatchByUserId(id: $id) {
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
      variables: function(){
        return {
          id: this.$route.params.otherId,
        };
      },
      error: function(err) {
        this.error = err.message;
      },
      subscribeToMore: {
        document: gql`subscription message($id: String!) {
          message(id: $id) {
            message_id,
            content,
            timestamp,
            sender {
              user_id
            },
            receiver {
              user_id
            }
          }
        }`,
        variables () {
          return {
            id: this.$route.params.otherId,
          }
        },
        updateQuery: function({match}, { subscriptionData }) {
          if((subscriptionData.data.message.sender.user_id === this.user.user_id && subscriptionData.data.message.receiver.user_id === match.other_user.user_id) ||
            (subscriptionData.data.message.sender.user_id === match.other_user.user_id && subscriptionData.data.message.receiver.user_id === this.user.user_id)
          ) {
            match.messages.push(subscriptionData.data.message);
          }
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
