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
                  multiple
                  prepend-icon="mdi-camera"
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip small label color="primary">
                      <div v-if="photoData[index]">
                        <img :src="photoData[index]" />
                      </div>
                      <div v-else>{{ text }}</div>
                    </v-chip>
                  </template>
                </v-file-input>
              </v-row>
              <v-row align="center" justify="center">
                <v-select
                  dark
                  v-model="setupForm.residence"
                  :items="residences"
                  item-value="residence_id"
                  item-text="name"
                  menu-props="auto"
                  label="Residence"
                  hide-details
                  prepend-icon="mdi-home"
                  single-line
                ></v-select>
              </v-row>
              <v-row align="center" justify="center" class="mt-10">
                <v-textarea
                  dark
                  outlined
                  name="biography"
                  label="Biography"
                  v-model="setupForm.biography"
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
                >
                  <template v-slot:selection="{ item }">
                    <v-chip>
                      <span>{{ item.name }}</span>
                    </v-chip>
                  </template>
                </v-combobox>
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
    <v-snackbar color="error" bottom :value="error ? 'visible' : undefined">
      <div class="text-center" style="background-color: transparent">{{error}}</div>
    </v-snackbar>
    <v-snackbar color="success" top :value="success ? 'visible' : undefined">
      <div class="text-center" style="background-color: transparent">{{success}}</div>
    </v-snackbar>
  </v-container>
</template>

<script>
import Quiz from "./Quiz";
import gql from "graphql-tag";

export default {
  name: "ProfileSetUp",
  components: {
    Quiz
  },
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
        personality: ""
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
        personality_id
      } = this.setupForm;

      // input checking
      if (
        !profilePictures.length ||
        !residence ||
        !biography ||
        !gender ||
        !desiredGenders ||
        !seriousness ||
        !personality_id
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
            residence_id: Number(residence),
            biography,
            gender_id: Number(gender.gender_id),
            desiredGenders: desiredGenders.map(Number),
            seriousness: Number(seriousness),
            personality_id
          }
        }
      });
      this.success = res.data.setupUser.message;
      setTimeout(() => this.$router.push("main"), 500);
    }
  },
  watch: {
    error: function(value) {
      value.length &&
        setTimeout(() => this.error = "", 1500);
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
