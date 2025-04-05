<template>
  <div>
    <component :is="tabComponent" :user="user" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import ProfileTabPosts from './profile-tabs/ProfileTabPosts.vue'
import ProfileTabSaves from './profile-tabs/ProfileTabSaves.vue'
//import ProfileTabBubbles from './profile-tabs/ProfileTabBubbles.vue'
//import ProfileTabActivity from './profile-tabs/ProfileTabActivity.vue'
//import ProfileTabAbout from './profile-tabs/ProfileTabAbout.vue'

const props = defineProps({
  tab: String,
  user: Object,
})

const tabComponent = computed(() => {
  switch (props.tab) {
    case 'posts':
      return ProfileTabPosts
    case 'saves':
      return ProfileTabSaves

    default:
      return ProfileTabPosts
  }
})
</script>
