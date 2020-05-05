<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "tiNDer",

  data: () => ({
    //
  })
};
</script>

<style lang="scss">
$body-font-family: roboto;
html {
  overflow: hidden !important; // i know i know but it's vuetify's fault, this is necessary for firefox

  body {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  body::-webkit-scrollbar {
    display: none;
  }

  font-family: $body-font-family, sans-serif !important;
}
</style>