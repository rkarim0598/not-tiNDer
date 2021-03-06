<template>
  <v-container class="setup-container" fill-height fluid align-center>
    <v-form @submit="performSetup">
      <v-stepper dark v-model="page">
        <v-stepper-header>
          <v-stepper-step :complete="page > 1" editable step="1">Basic Profile</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="page > 2" editable step="2">Match Preferences</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="page > 3" editable step="3">Personality</v-stepper-step>
          <v-stepper-step editable step="4">Review</v-stepper-step>
          <!--TODO make step 3 not accessible until previous set or make not complete until all on previous complete-->
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-container fill-height fluid align-center justify-space-between>
              <v-row align="center" justify="center">
                <!-- TODO look nicer -->
                <v-file-input
                  v-model="setupForm.profilePictures"
                  accept="image/*"
                  placeholder="Upload your pictures"
                  label="Pictures"
                  hint="Ctrl-click for multiple"
                  persistent-hint
                  multiple
                  prepend-icon="mdi-camera"
                >
                  <template v-slot:selection="{ index, text }">
                      <div v-if="photoData[index]">
                        <v-card outlined>
                          <img :src="photoData[index]" height="100px" />
                        </v-card>
                      </div>
                      <div v-else><v-chip small label color="primary">{{ text }}</v-chip></div>
                  </template>
                </v-file-input>
              </v-row>
              <v-row align="center" justify="center">
                <v-combobox
                  dark
                  v-model="setupForm.residence"
                  :items="residences"
                  item-value="residence_id"
                  item-text="name"
                  menu-props="auto"
                  label="Residence"
                  hint="Type out your building if you don't see it"
                  persistent-hint
                  prepend-icon="mdi-home"
                  single-line
                  maxlength="30"
                  counter="30"
                  :rules="[checkValue]"
                ></v-combobox>
              </v-row>
              <v-row align="center" justify="center">
                <v-text-field
                  label="Nickname"
                  placeholder="Nickname"
                  class="mt-5"
                  maxlength="30"
                  counter="30"
                  v-model="setupForm.nickname"
                ></v-text-field>
              </v-row>
              <v-row align="center" justify="center">
                <v-textarea
                  dark
                  outlined
                  name="biography"
                  label="Biography"
                  class="mt-5"
                  v-model="setupForm.biography"
                  counter="400"
                  maxlength="400"
                ></v-textarea>
              </v-row>
              <v-row align="center" justify="center">
                <v-col sm="6" offset-sm="6">
                  <v-btn outlined block dark @click="page++">Next</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-container fill-height fluid align-center justify-space-between>
              <v-row align="center" justify="center">
                <v-combobox
                  v-model="setupForm.gender"
                  :items="genders"
                  item-value="gender_id"
                  item-text="name"
                  label="Your gender"
                  hint="Type out your gender if you don't see it"
                  persistent-hint
                  :rules="[checkValue]"
                ></v-combobox>
              </v-row>
              <v-row align="center" justify="center">
                <v-select
                  v-model="setupForm.desiredGenders"
                  :items="genders"
                  item-value="gender_id"
                  item-text="name"
                  label="Genders interested in"
                  multiple
                >
                  <template v-slot:selection="{ item }">
                    <v-chip>
                      <span>{{ item.name }}</span>
                    </v-chip>
                  </template>
                </v-select>
              </v-row>
              <v-row align="center" justify="center">
                <!-- TODO slider or selector -->
                <v-slider
                  v-model="setupForm.seriousness"
                  label="Desired seriousness"
                  min="1"
                  max="5"
                ></v-slider>
              </v-row>
              <v-row align="center" justify="center">
                <v-col sm="6">
                  <v-btn outlined block dark @click="page--">Back</v-btn>
                </v-col>
                <v-col sm="6">
                  <v-btn outlined block @click="page++">Next</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-stepper-content>
          <v-stepper-content step="3">
            <quiz @complete="updatePersonality"></quiz>
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-container fill-height fluid align-center justify-space-between>
              <v-row align="center" justify="center" class="mb-3">
                <div class="headline white--text">Review</div>
              </v-row>
              <v-row align="center" justify="center" class="mb-3">
                <div class="title white--text">Are you ready?</div>
              </v-row>
              <v-row align="center" justify="center">
                <v-btn outlined block color="success" type="submit">Submit</v-btn>
              </v-row>
            </v-container>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-form>
    <error-snackbar :error="error"></error-snackbar>
    <v-snackbar color="success" top :value="success ? 'visible' : undefined">
      <div class="text-center" style="background-color: transparent">{{success}}</div>
    </v-snackbar>
  </v-container>
</template>

<script>
import Quiz from "../components/Quiz";
import gql from "graphql-tag";
import mixin from '../mixin';
import ErrorSnackbar from "../components/ErrorSnackbar"

export default {
  name: "ProfileSetUp",
  components: {
    Quiz,
    ErrorSnackbar
  },
  mixins: [mixin],
  data: function() {
    return {
      page: 1,
      residences: [],
      genders: [],
      seriousness: [],
      setupForm: {
        profilePictures: [],
        residence: "",
        biography: "",
        gender: "",
        desiredGenders: [],
        seriousness: 0,
        personality: "",
        nickname: ""
      },
      error: "",
      success: ""
    };
  },
  // Is there a better way of doing this?
  asyncComputed: {
    photoData: async function() {
      return Promise.all(this.setupForm.profilePictures.map(this.loadPicture));
    }
  },
  apollo: {
    residences: gql`
      query {
        residences: findResidences {
          residence_id
          name
        }
      }
    `,
    genders: gql`
      query {
        genders: findGenders {
          gender_id
          name
        }
      }
    `
  },
  methods: {
    checkValue: function(value) {
      console.log(value);
      return Number.isNaN(Number(value));
    },
    updatePersonality: async function(value) {
      this.setupForm.personality_id = value;

      setTimeout(() => {
        this.page = 4;
      }, 500);
    },
    loadPicture: async function(file) {
      //TODO caching
      var fr = new FileReader();
      fr.readAsDataURL(file);
      return new Promise(resolve => (fr.onload = () => resolve(fr.result)));
    },
    performSetup: async function(e) {
      e.preventDefault();
      const {
        residence,
        biography,
        gender,
        desiredGenders,
        seriousness,
        profilePictures,
        personality_id,
        nickname
      } = this.setupForm;

      // input checking
      if (
        !profilePictures.length ||
        !residence ||
        !biography ||
        !gender ||
        !desiredGenders ||
        !seriousness ||
        !personality_id ||
        !nickname
      ) {
        this.error = "One or more empty fields";
        return false;
      }

      let res = await this.$apollo.mutate({
        mutation: gql`
          mutation($input: SetupUserInput) {
            setupUser(input: $input) {
              failure
              message
              data
            }
          }
        `,
        variables: {
          input: {
            photos: profilePictures,
            residence: residence.residence_id || residence,
            biography,
            gender: gender.gender_id || gender,
            desiredGenders: desiredGenders.map(Number),
            seriousness: Number(seriousness),
            personality_id,
            nickname
          }
        }
      });
      this.success = res.data.setupUser.message;
      setTimeout(() => this.$router.push("main"), 500);
    }
  },
  watch: {
    error: function(value) {
      if (this.checkLoggedIn(value)) this.$router.push('login');
      value.length && setTimeout(() => (this.error = ""), 1500);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.setup-container {
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0) linear-gradient(rgb(111, 0, 0), rgb(32, 1, 34))
    repeat scroll 0% 0%;
}

.v-form {
  display: flex;
  height: 80%;
  max-width: 92%;
  min-width: 300px;
  align-items: center;
}

.v-stepper {
  min-width: 100%;
}
</style>
