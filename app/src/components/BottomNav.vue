<template>
  <v-layout class="bottom-nav" align-end justify-end>
    <v-bottom-navigation class="fill-width" :value="data.activeIndex" grow color="teal" dark>
      <v-btn v-for="tab in data.tabs" :key="tab.title">
        <span>{{ tab.title }}</span>
        <v-icon>{{ tab.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script>
export default {
  name: "BottomNav",
  props: {
    data: Object
  }
}
</script>
<style lang="scss" scoped>
.bottom-nav {
  display: flex;
  align-self: flex-end;
  width: 100%;
  height: 56px !important;
}
</style>