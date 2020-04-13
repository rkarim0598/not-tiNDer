<template>
  <div>
    <div>
      <h1>Login</h1>
      <div class="container">
        <input v-model="login.username" type="text" placeholder="Email" />
        <input v-model="login.password" type="password" placeholder="Password" />
        <button @click="performLogin">Login</button>
      </div>
    </div>
    <div>
      <h1>Sign Up</h1>
      <div class="container">
        <input v-model="signup.firstName" type="text" placeholder="First Name" />
        <input v-model="signup.lastName" type="text" placeholder="Last Name" />
        <input v-model="signup.username" type="text" placeholder="Email" />
        <input v-model="signup.password" type="password" placeholder="Password" />
        <input v-model="signup.confirmedPassword" type="password" placeholder="Password" />
        <button @click="performSignup">Sign Up</button>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "HelloWorld",
  data: function() {
    return {
      login: {
        username: "",
        password: ""
      },
      signup: {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmedPassword: ""
      }
    };
  },
  methods: {
    performLogin: async function() {
      const { username, password } = this.login;
      let res = await this.$apollo.query({
        query: gql`
          query login($email: String, $password: String) {
            login(email: $email, password: $password) {
              failure
              message
              data
            }
          }`,
        variables: {
          email: username,
          password: password
        }
      });
      alert(res.data.login.message);
    },
    performSignup: async function() {
      const { username, password, confirmedPassword, firstName, lastName } = this.signup;
      // input checking
      if (password !== confirmedPassword) {
        alert("Passwords don't match");
        return;
      } else if (Object.values(this.signup).filter(val => val.length === 0).length) {
        alert("One or more empty fields");
        return;
      }

      let res = await this.$apollo.mutate({
        mutation: gql`
          mutation ($input: NewUserInput) {
            createUser(input: $input) {
              failure
              message
              data
            }
          }`,
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.container {
  display: flex;
  flex-direction: column;
}
</style>
