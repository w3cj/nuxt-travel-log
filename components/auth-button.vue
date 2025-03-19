<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <button :disabled="authStore.loading" class="btn btn-accent" @click="authStore.signIn">
    Sign In With Github
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
    <Icon v-else name="tabler:brand-github" size="24" />
  </button>
</template>
