<template>
  <q-dialog v-model="dialogOpen" maximized persistent>
    <q-card class="bg-dark text-white">
      <q-bar>
        <div class="text-h6">Edit Post</div>
        <q-space />
        <q-btn dense flat icon="sym_o_close" v-close-popup />
      </q-bar>

      <q-card-section>
        <q-editor
          :dark="true"
          toolbar-text-color="white"
          content-class="text-white"
          v-model="editedContent"
          min-height="200px"
          height="auto"
          placeholder="Edit your post..."
          :definitions="{
            media: {
              icon: 'sym_o_upload',
              label: 'Upload Media',
              tip: 'Upload image or video',
              handler: openFilePicker,
            },
          }"
          :toolbar="[
            ['bold', 'italic', 'strike', 'underline'],
            ['hr', 'link', 'unordered', 'ordered'],
            ['media'],
            ['fullscreen'],
          ]"
          class="q-mb-md text-black dropzone"
        />

        <input
          type="file"
          ref="fileInputRef"
          style="display: none"
          accept="image/*,video/*"
          @change="handleFileChange"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn label="Save" color="primary" @click="submit" :disable="!editedContent.trim()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { uploadPostMedia } from 'src/db/storage'
import { notifyError } from 'src/utils/notify'

const props = defineProps({
  modelValue: Boolean,
  content: String,
  postId: String,
})

const dialogOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const emit = defineEmits(['update:modelValue', 'updated'])

const editedContent = ref('')
const fileInputRef = ref(null)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      editedContent.value = props.content || ''
    }
  },
)

function openFilePicker() {
  fileInputRef.value?.click()
}

async function handleFileChange(event) {
  const files = event.target.files
  if (!files || files.length === 0) return

  for (const file of files) {
    try {
      const url = await uploadPostMedia(file)
      embedMedia(url)
    } catch (err) {
      notifyError('Upload failed: ' + err.message)
    }
  }

  event.target.value = null
}

function embedMedia(url) {
  if (url.endsWith('.mp4')) {
    editedContent.value += `<video controls width="100%"><source src="${url}" type="video/mp4"></video><br/>`
  } else {
    editedContent.value += `<img src="${url}" style="max-width: 100%;" /><br/>`
  }
}

async function submit() {
  emit('updated', { postId: props.postId, content: editedContent.value.trim() })
  emit('update:modelValue', false)
}
</script>

<style scoped>
.dropzone {
  border: 2px dashed transparent;
}
.dropzone:hover {
  border-color: #4dabf7;
}
</style>
