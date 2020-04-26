<template>
  <div>
    {{$route.params.matchId}}
    {{user.user_id}}
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "Messages",
  data: function() {
    return {
      user: {
        id: 'default'
      },
      matchId: Number(this.$route.params.matchId)
    };
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
          id: this.matchId
        };
      }
    }
  }
}
</script>