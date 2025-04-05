<template>
  <div class="uploader">
    <q-uploader
      label="Upload Image or Video"
      color="primary"
      accept="image/*,video/*"
      :factory="uploadFactory"
      @uploaded="handleUpload"
      auto-upload
      multiple
    />
  </div>
</template>

<script setup>
import { uploadPostMedia } from 'src/db/storage'
import { useAuthStore } from 'stores/auth-store'
import { notifyError, notifySuccess } from 'src/utils/notify'

const emit = defineEmits(['media-uploaded'])
const auth = useAuthStore()

/**
 * Upload handler used by q-uploader
 */
async function uploadFactory(files) {
  const urls = []
  for (const file of files) {
    try {
      const url = await uploadPostMedia(file, auth.user.id)
      urls.push(url)
    } catch (err) {
      notifyError(`Upload failed ${err}`)
    }
  }
  return urls
}

function handleUpload({ files }) {
  files.forEach((f) => emit('media-uploaded', f.__uploaded))
  notifySuccess('Media uploaded')
}
</script>

<style scoped>
.uploader {
  padding: 16px 0;
}
</style>
