<template>
  <div>
    <MyEditor v-model="yourContent" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MyEditor from "@/components/imcoder-tinymce/index.vue";

const yourContent = ref("qasda");
</script>

<style lang="scss" scoped></style>
