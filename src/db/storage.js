// src/db/storage.js
import { supabase } from 'boot/supabase'

const BUCKET_NAME = 'post-media'

/**
 * Uploads a file to Supabase Storage under post-media/{userId}/{filename}
 * @param {File} file
 * @param {string} userId
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export async function uploadPostMedia(file, userId) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  return getPublicUrl(filePath)
}

/**
 * Returns the public URL for a given file path in post-media bucket
 * @param {string} path
 * @returns {string}
 */
export function getPublicUrl(path) {
  const { publicUrl } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
  return publicUrl
}

/**
 * Optionally: Delete media from post-media bucket
 * @param {string} path
 */
export async function deletePostMedia(path) {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])
  if (error) throw error
}
