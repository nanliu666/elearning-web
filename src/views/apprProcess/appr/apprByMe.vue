<template>
  <appr-common-list data-type="my" />
</template>

<script>
export default {
  name: 'ApprByMe',
  components: {
    ApprCommonList: () => import('./apprCommonList')
  }
}
</script>
