<template>
  <v-container class="setup-container" fill-height fluid align-center>
    <v-form @submit="performSetup">
      <v-stepper dark v-model="page">
        <v-stepper-header>
          <v-stepper-step :complete="page > 1" editable step="1">Basic Profile</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="page > 2" editable step="2">Match Preferences</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step editable step="3">Personality</v-stepper-step>
          <!--TODO make step 3 not accessible until previous set or make not complete until all on previous complete-->
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-container fill-height fluid align-center justify-space-between>
              <v-row align="center" justify="center">
                <v-file-input v-model="setup.profilePictures" accept="image/*" placeholder="Upload your pictures" label="Pictures" multiple prepend-icon="mdi-camera">
                  <template v-slot:selection="{ file, text }">
                    <!--{{ file }} -->
                    <v-chip small label color="primary">
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-row>
              <v-row align="center" justify="center">
                <v-select dark v-model="setup.dorm" :items="dorms" menu-props="auto" label="Dorm" hide-details prepend-icon="mdi-home" single-line></v-select>
              </v-row>
              <v-row align="center" justify="center">
                <v-textarea dark outlined name="biography" label="Biography" v-model="setup.biography" ></v-textarea>
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
                <v-select v-model="setup.gender" :items="genders" label="Your gender">
                  <template v-slot:selection="{ item }">
                    <v-chip>
                      <span>{{ item }}</span>
                    </v-chip>
                  </template>
                </v-select>
              </v-row>
              <v-row align="center" justify="center">
                <v-select v-model="setup.desiredGenders" :items="genders" label="Genders interested in" multiple>
                  <template v-slot:selection="{ item }">
                    <v-chip>
                      <span>{{ item }}</span>
                    </v-chip>
                  </template>
                </v-select>
              </v-row>
              <v-row align="center" justify="center">
                <v-select v-model="setup.seriousness" :items="seriousness" label="Desired seriousness" multiple></v-select>
              </v-row>
              <v-row align="center" justify="center">
                <v-col sm="6">
                  <v-btn outlined block dark @click="page--">Back</v-btn>
                </v-col>
                <v-col sm="6">
                  <v-btn outlined block dark @click="page++">Next</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-container fill-height fluid align-center justify-space-between>
              <v-row align="center" justify="center">
                <v-text-field dark v-model="setup.personality.first" label="Question 1" required />
              </v-row>
              <v-row align="center" justify="center">
                <v-col sm="6">
                  <v-btn outlined block dark @click="page--">Back</v-btn>
                </v-col>
                <v-col sm="6">
                  <v-btn outlined block color="success" type="submit">Join</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-form>
  </v-container>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "ProfileSetUp",
  data: function() {
    return {
      page: 1,
      setup: {
        profilePictures: [],
        dorm: "",
        biography: "",
        gender: "",
        desiredGenders: [],
        seriousness: 0,
        personality: {

        }
      }
    };
  },
  methods: {
  performSetup: async function() {
    const {
    username,
    password,
    confirmedPassword,
    firstName,
    lastName
    } = this.signup;

    // input checking
    if (password !== confirmedPassword) {
    alert("Passwords don't match");
    return;
    } else if (
    Object.values(this.signup).filter(val => val.length === 0).length
    ) {
    alert("One or more empty fields");
    return;
    }

    let res = await this.$apollo.mutate({
    mutation: gql`
      mutation($input: NewUserInput) {
      createUser(input: $input) {
        failure
        message
        data
      }
      }
    `,
    variables: {
      input: {
      user_id: username,
      password: password,
      first_name: firstName,
      last_name: lastName
      }
    }
    });
    alert(res.data.createUser.message);
    
    if (!res.data.createUser.failure) {
    this.$router.push('/login');
    }
  }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.setup-container {
  display: flex;
  justify-content: center;
  background: linear-gradient(darkblue, black);
}

.v-form {
  height: 80%;
}
</style>
