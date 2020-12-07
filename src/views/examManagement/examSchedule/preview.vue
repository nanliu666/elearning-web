<template>
  <div class="preview-style">
    <page-header
      title="预览试卷"
      show-back
    />
    <basic-container>
      111
    </basic-container>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss"></style>
