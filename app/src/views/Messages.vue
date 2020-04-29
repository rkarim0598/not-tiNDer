<template>
  <v-container class="messages-container" fill-height fluid align-center>
    <v-container fill-height fluid align-center justify-space-between>
      <!-- Is loading: {{this.$apollo.queries.match.loading}} -->
      <v-container dark style="max-height: 80vh" class="overflow-y-auto">
        <div v-if="match">
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
      </v-container>
      <v-container>
        <v-textarea outlined :disabled="!match" v-model="draftMessage" @keypress="handleKeypress" :append-icon="draftMessage ? 'mdi-send' : undefined" @click:append="sendMessage" rows="1" label="Enter Message" auto-grow>
        </v-textarea>
      </v-container>
    </v-container>
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
      draftMessage: ''
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
              match_id: Number(this.$route.params.matchId),
              content: this.draftMessage,
            }
          }
        });
      } catch (err) {
        console.error(err);
        return;
      }
      this.draftMessage = '';
    }
  },
  watch: {
    $route: function(to) {
      this.$apollo.queries.match.setVariables({
        id: Number(to.params.matchId)
      });
    }
  },
  apollo: {
    user: gql`query {
      user: findUser {
        user_id,
        nickname
      }
    }`,
    match: {
      query: gql`query ($id: Int!){
        match: findMatchById(id: $id) {
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
          id: Number(this.$route.params.matchId),
        };
      },
      error: function(error) {
        console.log(error);
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
