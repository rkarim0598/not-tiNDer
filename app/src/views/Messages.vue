<template>
  <v-container class="messages-container" fill-height fluid align-center>
    <v-container fill-height fluid align-center justify-space-between>
      <!-- Is loading: {{this.$apollo.queries.match.loading}} -->
      <v-container dark style="max-height: 400px" class="overflow-y-auto">
        <div v-if="match">
          <div v-for="message in match.messages" :key="message.message_id">
            <v-card outline>
              <v-card-text>
                {{message.content}}
                {{new Date(Number(message.timestamp))}}
              </v-card-text>
            </v-card>
            <br>
          </div>
        </div>
      </v-container>
      <v-container>
        <v-textarea v-model="draftMessage" @keypress="handleKeypress" :append-icon="draftMessage ? 'mdi-send' : undefined" @click:append="sendMessage" rows="1" label="Enter Message" auto-grow>
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
