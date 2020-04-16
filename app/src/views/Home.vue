<template>
  <v-container class="home-page-container">
    <div class="image-container">
      <h1 class="text">Application Name</h1>
      <span class="text">
        Yadda yadda yadda something about meeting the love
        of your life here. Press the subscribe button down
        below. We are willing to sell this idea if you're looking
        at this please take it from us.
      </span>
      <div class="button-container">
        <v-btn class="ma-2" block outlined color="success" to="/login">Log In</v-btn>
        <v-btn class="ma-2" block outlined color="primary" to="/signup">Sign Up</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home-page-container {
  padding: 0;
  height: 100%;
  width: 100%;
}

.image-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  background: linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ), url(../assets/hand-holding.jpg);
  background-size: 100% 100%;
  text-align: center;

  .text {
    color: white;
  }

  span.text {
    max-width: 80%;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 25%;
    width: 80%;
  }
}
</style>

