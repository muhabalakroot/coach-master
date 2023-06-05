<template>
  <base-card>
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" />
      </div>
      <div class="form-control">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <p v-if="!formIsValid">Incorrect Email or Password</p>
      <div class="actions">
        <base-button>{{ buttonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchButton">{{
          switchButtonCaption
        }}</base-button>
      </div>
    </form>
  </base-card>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      formIsValid: true,
      mode: 'login',
    };
  },
  computed: {
    buttonCaption() {
      if (this.mode === 'login') {
        return 'Login';
      } else {
        return 'Sing up';
      }
    },
    switchButtonCaption() {
      if (this.mode === 'login') {
        return 'Sing up Insted';
      } else {
        return 'Login Insted';
      }
    },
  },
  methods: {
    submitForm() {
      this.formIsValid = true;
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }
      if (this.mode === 'login') {
        //
      } else {
        this.$store.dispatch('signup', {
          password: this.password,
          email: this.email,
        });
      }
    },
    switchButton() {
      if (this.mode === 'login') {
        this.mode = 'singup';
      } else {
        this.mode = 'login';
      }
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
