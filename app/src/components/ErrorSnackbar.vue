<template>
  <v-snackbar color="error" bottom :value="error ? 'visible' : undefined">
    <div class="text-center" style="background-color: transparent">{{message}}</div>
  </v-snackbar>
</template>

<script>
export default {
  name: 'ErrorSnackbar',
  props: ['error'],
  computed: {
    message: function() {
      if(!this.error) return undefined;
      if(this.error.networkError) {
        return 'Could not connect to server';
      } else if(this.error.graphQLErrors && this.error.graphQLErrors[0]) {
        return this.error.graphQLErrors[0].message;
      } else {
        return this.error.message;
      }
    }
  }
}

</script>
