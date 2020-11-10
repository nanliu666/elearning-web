<template>
  <appr-common-list data-type="has" />
</template>

<script>
export default {
  name: 'ApprByMe',
  components: {
    ApprCommonList: () => import('./apprCommonList')
  }
}
</script>
