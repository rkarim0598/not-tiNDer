<template>
  <v-layout class="bottom-nav" align-end justify-end>
    <v-bottom-navigation class="fill-width" :value="activeBtn" grow color="teal" dark>
      <v-btn>
        <span>Recents</span>
        <v-icon>mdi-history</v-icon>
      </v-btn>

      <v-btn>
        <span>Favorites</span>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn>
        <span>Nearby</span>
        <v-icon>mdi-map-marker</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<style lang="scss" scoped>
.bottom-nav {
    width: 100vw;
    height: 56px;
    align-self: flex-end;
}
</style>