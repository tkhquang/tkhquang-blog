<template>
  <div>
    <p class="mx-auto text-center">
      <strong>
        Get rekt!
      </strong>
      I'll send new posts to your inbox.
    </p>
    <form
      class="email-form relative w-full pt-5 flex flex-wrap flex-center text-center"
      name="newsletter"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      @submit.prevent="handleSubmit"
    >
      <div hidden aria-hidden="true">
        <label>
          Don’t fill this out if you're human:
          <input name="bot-field" />
        </label>
      </div>
      <template v-if="!status || status === 'fetching'">
        <label for="email" class="opacity-0 absolute inset-0 z-bg">
          Your email
        </label>
        <input
          id="email"
          v-model="email"
          class="input h-10 px-2 min-w-full mb-5"
          type="email"
          name="email"
          placeholder="your-email@address.ex"
          required
        />
        <button
          type="submit"
          class="button w-32"
          :disabled="status === 'fetching'"
        >
          <template v-if="status !== 'fetching'">
            Subscribe
          </template>
          <template v-else>
            <span class="flex-center">
              <v-icon name="loader" class="spinner w-4 h-4"></v-icon>
            </span>
          </template>
        </button>
      </template>
      <div v-else-if="status === 'success'" class="text-theme-success">
        <p>
          <v-icon name="check-circle" class="w-4 h-4 inline-block"></v-icon>
          Almost there! Check your inbox for a confirmation e-mail.
        </p>
      </div>
      <div v-else-if="status === 'error'" class="text-theme-error">
        <p>
          <v-icon name="x-circle" class="w-4 h-4 inline-block"></v-icon>
          Error, please try again!
        </p>
        <p class="my-2">
          {{ errorMessage }}
        </p>
        <button type="button" class="button mx-auto" @click="retryHandler">
          Retry
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { request, errHandler } from "~/utils";

export default {
  data() {
    return {
      email: "",
      status: "",
      errorMessage: ""
    };
  },

  methods: {
    handleSubmit() {
      this.status = "fetching";
      request({
        url: "/api/newsletter-signup",
        method: "POST",
        data: {
          "form-name": "newsletter",
          email: this.email
        }
      })
        .then(({ data }) => {
          console.log("Signup Data: ", data);
          this.status = "success";
        })
        .catch((err) => {
          const error = errHandler(err);
          console.error(errHandler(err));

          this.status = "error";

          if (error.response.data && error.response.data.message) {
            this.errorMessage = error.response.data.message;

            return;
          }

          if (error.message) {
            this.errorMessage = error.message;
          }
        });
    },

    retryHandler() {
      this.status = "";
      this.errorMessage = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.spinner {
  animation: spin 4s linear infinite;
}
</style>
