<template>
  <v-fade-transition hide-on-leave>
    <div v-if="matches" class="flex-grow-1 overflow-y-auto" style="flex-basis: 0">
      <div v-if="matches.length">
        <div v-for="(match, index) of matches" :key="match.match_id" class="py-1">
          <v-hover v-slot:default="{ hover }">
            <v-card outlined dark @click="openMessages(match.other_user.user_id)" :elevation="hover ? 5 : 2">
              <div class="px-5">
                <v-row class="d-flex">
                  <v-col style="flex-basis: 1; flex-grow: 0">
                    <v-avatar color="indigo">
                      <img v-if="match.other_user.avatar" :src="'/photo/' + match.other_user.avatar"/>
                      <v-icon v-else dark>mdi-account-circle</v-icon>
                    </v-avatar>
                  </v-col>
                  <v-col class="py-1">
                    <v-row class="d-flex justify-space-between">
                      <div class="py-1">
                        <p class="mb-0">{{match.other_user.first_name}} {{match.other_user.last_name}}</p>
                      </div>
                      <div class="py-1">
                        <p
                          v-if="match.latest_message"
                          class="caption mb-0"
                        >{{formatDate(index)}}</p>
                      </div>
                    </v-row>
                    <v-row class="d-flex">
                      <div v-if="match.latest_message">
                        <pre
                          class="body-2 mb-0"
                          :class="match.other_user.user_id == match.latest_message.user_id ? 'indigo--text font-weight-medium' : undefined"
                        >{{match.latest_message.content.substr(0, 30)}}...</pre>
                      </div>
                      <div v-else>
                        <p class="mb-0">Get the conversation started!</p>
                      </div>
                      <!-- {{match.unread_messages}} -->
                    </v-row>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-hover>
        </div>
      </div>
      <div v-else><p class="white--text">No matches yet, get swiping!</p></div>
    </div>
    <div v-else>
      <div v-if="query.loading">
        <div v-for="i in 5" :key="i" class="py-1">
          <v-card dark outlined>
            <div class="px-5">
              <v-row class="d-flex">
                <v-col style="flex-basis: 1; flex-grow: 0">
                  <v-skeleton-loader dark type="avatar"></v-skeleton-loader>
                </v-col>
                <v-col class="py-1">
                  <v-row class="d-flex justify-space-between">
                    <div class="py-1">
                      <v-skeleton-loader dark type="text" style="min-width: 100px"></v-skeleton-loader>
                    </div>
                    <div class="py-1">
                      <v-skeleton-loader dark type="text" style="min-width: 50px"></v-skeleton-loader>
                    </div>
                  </v-row>
                  <v-row>
                    <v-skeleton-loader dark style="min-width: 100%" type="sentences"></v-skeleton-loader>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </div>
      </div>
      <div v-else><p class="white--text">Could not load matches</p></div>
    </div>
  </v-fade-transition>
</template>

<script>

export default {
  props: {
    query: Object,
    matches: Array
  },
  methods: {
    formatDate: function(index) {
      const date = new Date(
        Number(this.matches[index].latest_message.timestamp)
      );
      if (new Date().toLocaleDateString() == date.toLocaleDateString()) {
        return date.toLocaleTimeString();
      }
      return date.toLocaleString();
    },
    openMessages: function(id) {
      this.$router.push("messages/" + id);
    }
  },
}
</script>