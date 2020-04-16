<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  })
};
</script>

<style lang="scss">
$body-font-family: roboto;
html{
  body {
    height: 100vh;
    width: 100vw;
  }
  font-family: $body-font-family, sans-serif !important;
}
</style>