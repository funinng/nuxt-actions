<template>
  <div>
    <h1>照片 EXIF 信息读取器</h1>
    <input type="file" accept="image/*" @change="handleFileChange" />

    <div v-if="imageData">
      <h2>预览</h2>
      <img
        :src="imageData"
        alt="Image preview"
        style="max-width: 500px; max-height: 500px"
      />
    </div>

    <div v-if="exifData">
      <h2>EXIF 信息</h2>
      <p><strong>相机型号:</strong> {{ exifData.Make }} {{ exifData.Model }}</p>
      <p><strong>ISO:</strong> {{ exifData.ISO }}</p>
      <p><strong>光圈:</strong> f/{{ exifData.FNumber }}</p>
      <p><strong>拍摄时间:</strong> {{ exifData.DateTimeOriginal }}</p>
      <div
        v-if="
          exifData.latitude !== undefined && exifData.longitude !== undefined
        "
      >
        <p>
          <strong>地点 (纬度, 经度):</strong> {{ exifData.latitude }},
          {{ exifData.longitude }}
        </p>
      </div>
      <div
        v-if="
          !exifData.Make &&
          !exifData.Model &&
          !exifData.ISO &&
          !exifData.FNumber &&
          !exifData.DateTimeOriginal &&
          exifData.latitude === undefined
        "
      >
        <p>未找到关键 EXIF 信息。</p>
      </div>

      <!-- Optionally display all tags for debugging -->
      <!-- 
      <h3>所有 EXIF 标签 (原始数据)</h3>
      <pre>{{ JSON.stringify(rawExifData, null, 2) }}</pre>
      -->
    </div>

    <div v-if="error">
      <h2>错误</h2>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import exifr from 'exifr'

const imageData = ref(null)
const exifData = ref(null)
const rawExifData = ref(null)
const error = ref(null)

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) {
    imageData.value = null
    exifData.value = null
    rawExifData.value = null
    error.value = null
    return
  }

  // Reset previous state
  imageData.value = null
  exifData.value = null
  rawExifData.value = null
  error.value = null

  // Read image for preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imageData.value = e.target.result
  }
  reader.readAsDataURL(file)

  // Read and parse EXIF data
  try {
    // Use default options which include IFD0, EXIF, GPS, and request expanded GPS
    const tags = await exifr.parse(file, {
      expanded: true,
      iptc: false,
      xmp: false
    })

    // Filter and store relevant tags
    exifData.value = {
      Make: tags.Make,
      Model: tags.Model,
      ISO: tags.ISO,
      FNumber: tags.FNumber,
      DateTimeOriginal: tags.DateTimeOriginal,
      latitude: tags.latitude,
      longitude: tags.longitude
    }
    rawExifData.value = tags // Store raw data optionally
  } catch (err) {
    error.value = err.message
    exifData.value = null
    rawExifData.value = null
  }
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
