<template>
  <v-container class="quiz-container" fill-height fluid align-center>
    <v-container class="inner-container" fill-height fluid align-center>
      <div>
        <div class="display-2 font-weight-light text">{{ title }}</div>
        <v-progress-linear v-model="percentComplete"></v-progress-linear>
      </div>
      <div v-if="current < questions.length" class="question-container">
        <div class="title font-weight-light text prefix">{{ questions[current].prefix }}</div>
        <v-radio-group dark :column="false" v-model="answers[current]" class="radio-container">
          <v-radio v-for="n in 5" :key="n" :value="n" @click="increment(n)"></v-radio>
        </v-radio-group>
        <div class="choices">
          <div class="text">{{ questions[current].options[0] }}</div>
          <div class="text">{{ questions[current].options[1] }}</div>
        </div>
      </div>
      <div v-else>
        <div class="title text">Your result is</div>
        <div class="display-3 text">{{ personalityType }}</div>
      </div>
      <v-btn
        v-if="current && current < questions.length"
        block
        outlined
        color="primary"
        @click="decrement"
      >Back</v-btn>
      <div v-else />
    </v-container>
  </v-container>
</template>

<script>
import quiz from "../quiz";

export default {
  name: "Quiz",
  data: function() {
    return {
      questions: quiz,
      answers: [],
      current: 0
    };
  },
  methods: {
    increment: function(n) {
      this.answers[this.current] = n;
      this.current++;
    },
    decrement: function() {
      this.current--;
    }
  },
  computed: {
    percentComplete: function() {
      return (this.current / this.questions.length) * 100;
    },
    title: function() {
      return this.current < this.questions.length
        ? "Personality Quiz"
        : "Results";
    },
    personalityType: function() {
      let results = {
        lists: {
          ie: [-2, -6, -10, 14, 18, 22, 26, 31],
          sn: [3, 7, 11, 15, 19, -23, -27, 31],
          ft: [-1, 5, 9, -13, -17, 21, -25, -29],
          jp: [0, 4, -8, 12, -16, 20, -24, 28]
        },
        values: {
          ie: 30,
          sn: 12,
          ft: 30,
          jp: 18
        },
        types: {
          ie: ["E", "I"],
          sn: ["N", "S"],
          ft: ["T", "F"],
          jp: ["P", "J"]
        }
      };

      let type = "";
      for (let key in results.values) {
        results.values[key] += results.lists[key]
          .map(n => (n < 0 ? -1 * this.answers[Math.abs(n)] : this.answers[n]))
          .reduce((a, b) => a + b);
        type += results.types[key][results.values[key] > 24 ? 0 : 1];
      }
      return type;
    }
  }
};
</script>

<style lang="scss">
.quiz-container {
  background: rgba(0, 0, 0, 0) linear-gradient(rgb(111, 0, 0), rgb(32, 1, 34))
    repeat scroll 0% 0%;

  .inner-container {
    display: flex;
    flex-direction: column;
    align-items: space-evenly;
    justify-content: space-around;
    max-width: 700px;
  }
  button {
    height: 15%;
    max-height: 80px;
  }
}

.text {
  color: white;
  text-align: center;
}

.prefix {
  width: 70%;
  margin: 0 auto;
}

.question-container {
  width: 100%;
  .radio-container {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    padding-top: 5%;
    padding-bottom: 5%;
  }
}

.choices {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .text {
    width: 30%;
  }
}

.v-input--radio-group__input {
  justify-content: space-evenly;
}
</style>