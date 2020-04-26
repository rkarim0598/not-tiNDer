<template>
  <v-container class="messages-container" fill-height fluid align-center>
    <v-container fill-height fluid align-center justify-space-between>
      MatchId: {{$route.params.matchId}}
      Is loading: {{this.$apollo.queries.match.loading}}
      User:
      <div v-if="user">
        {{user.user_id}}
      </div>
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
      match: undefined
    };
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
            message,
            timestamp,
            sender {
              user_id
            }
          }
        }
      }`,
      variables: function(){
        return {
          id: Number(this.$route.params.matchId)
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
