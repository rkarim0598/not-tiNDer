<template>
  <div>
    MatchId: {{$route.params.matchId}}
    Is loading: {{this.$apollo.queries.match.loading}}
    User:
    <div v-if="user">
      {{user.user_id}}
    </div>
  </div>
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
    $route: function(to, from) {
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