<template>
  <v-container class="py-8" max-width="800">
    <v-alert type="info" class="mb-4" border="start" variant="tonal">
      图片不会被上传，所有操作都在本地浏览器完成。
    </v-alert>

    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title class="text-h5 font-weight-bold"
            >照片 EXIF 信息读取器</v-card-title
          >
          <v-card-text>
            <v-file-input
              v-model="selectedFile"
              label="选择图片"
              accept="image/*"
              show-size
              prepend-icon="mdi-image"
              @update:model-value="handleFileSelect"
              outlined
            ></v-file-input>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="!selectedFile"
              class="mt-2"
              @click="parseExif"
              block
            >
              解析EXIF信息
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-col>
    </v-row>

    <v-row v-if="error">
      <v-col cols="12">
        <v-alert type="error" closable>
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-if="imageData || exifData">
      <v-col cols="12" md="6">
        <v-card v-if="imageData" class="mb-4">
          <v-card-title>预览</v-card-title>
          <v-card-text class="text-center">
            <v-img
              :src="imageData"
              max-height="400"
              contain
              class="bg-grey-lighten-2"
            ></v-img>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card v-if="exifData" class="mb-4">
          {{ allTags }}
          <v-card-title>EXIF 信息</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-if="exifData.image?.Make || exifData.image?.Model">
                <template v-slot:prepend>
                  <v-icon>mdi-camera</v-icon>
                </template>
                <v-list-item-title>相机型号</v-list-item-title>
                <v-list-item-subtitle>
                  {{ exifData.image?.Make }} {{ exifData.image?.Model }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="exifData.exif?.ISO">
                <template v-slot:prepend>
                  <v-icon>mdi-iso</v-icon>
                </template>
                <v-list-item-title>ISO</v-list-item-title>
                <v-list-item-subtitle>{{
                  exifData.exif?.ISO
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="exifData.exif?.FNumber">
                <template v-slot:prepend>
                  <v-icon>mdi-camera-iris</v-icon>
                </template>
                <v-list-item-title>光圈</v-list-item-title>
                <v-list-item-subtitle
                  >f/{{ exifData.exif?.FNumber }}</v-list-item-subtitle
                >
              </v-list-item>

              <v-list-item v-if="exifData.exif?.DateTimeOriginal">
                <template v-slot:prepend>
                  <v-icon>mdi-calendar</v-icon>
                </template>
                <v-list-item-title>拍摄时间</v-list-item-title>
                <v-list-item-subtitle>{{
                  exifData.exif?.DateTimeOriginal
                }}</v-list-item-subtitle>
              </v-list-item>

              <template
                v-if="
                  exifData.gps?.latitude !== undefined &&
                  exifData.gps?.longitude !== undefined
                "
              >
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-map-marker</v-icon>
                  </template>
                  <v-list-item-title>GPS 坐标</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formatCoordinate(exifData.gps.latitude, 'NS') }},
                    {{ formatCoordinate(exifData.gps.longitude, 'EW') }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-map</v-icon>
                  </template>
                  <v-list-item-title>地图链接</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-btn
                      variant="text"
                      density="compact"
                      color="primary"
                      :href="getGoogleMapsUrl"
                      target="_blank"
                      prepend-icon="mdi-google-maps"
                    >
                      在 Google Maps 中查看
                    </v-btn>
                    <v-btn
                      variant="text"
                      density="compact"
                      color="primary"
                      :href="getBaiduMapsUrl"
                      target="_blank"
                      prepend-icon="mdi-map-marker-radius"
                      class="ml-2"
                    >
                      在百度地图中查看
                    </v-btn>
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-list>

            <v-alert v-if="!hasExifData" type="warning" class="mt-4">
              未找到关键 EXIF 信息
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="!imageData && !loading">
      <v-col cols="12">
        <v-card class="text-center pa-4" color="grey-lighten-4">
          <v-icon size="48" class="mb-2">mdi-image-plus</v-icon>
          <div class="text-body-1">请选择一张图片开始解析</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import exifr from 'exifr'

const selectedFile = ref(null)
const imageData = ref(null)
const exifData = ref(null)
const error = ref(null)
const loading = ref(false)

const handleFileSelect = (file) => {
  if (!file) {
    resetState()
    return
  }

  // 仅预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    imageData.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const parseExif = async () => {
  if (!selectedFile.value) {
    error.value = '请先选择图片'
    return
  }

  try {
    loading.value = true
    error.value = null

    // 检查文件类型
    console.log('文件类型:', selectedFile.value.type)
    if (!selectedFile.value.type.startsWith('image/')) {
      throw new Error('请选择图片文件')
    }

    // 读取所有可能的EXIF数据以便调试
    const allTags = await exifr.parse(selectedFile.value, {
      mergeOutput: false // 获取原始数据结构
    })
    console.log('所有EXIF数据:', allTags)

    // 读取我们需要的特定标签
    const tags = await exifr.parse(selectedFile.value, {
      pick: [
        'Make',
        'Model', // 相机信息
        'ISO',
        'FNumber', // 拍摄参数
        'DateTimeOriginal', // 时间
        // GPS信息
        'GPSLatitude',
        'GPSLatitudeRef',
        'GPSLongitude',
        'GPSLongitudeRef',
        'GPSAltitude',
        'GPSAltitudeRef',
        'GPSDateStamp',
        'GPSTimeStamp',
        'GPSProcessingMethod'
      ],
      gps: true, // 启用GPS转换
      translateKeys: true, // 转换标签名称
      translateValues: true // 转换标签值
    })

    console.log('解析的标签:', tags)

    if (!tags) {
      throw new Error('未找到EXIF信息')
    }

    // 检查GPS信息
    const gpsInfo = {
      available: !!(tags.latitude && tags.longitude),
      raw: {
        latitude: tags.GPSLatitude,
        latitudeRef: tags.GPSLatitudeRef,
        longitude: tags.GPSLongitude,
        longitudeRef: tags.GPSLongitudeRef,
        altitude: tags.GPSAltitude,
        timestamp: tags.GPSTimeStamp,
        datestamp: tags.GPSDateStamp
      },
      processed: {
        latitude: tags.latitude,
        longitude: tags.longitude
      }
    }

    console.log('GPS信息:', gpsInfo)

    // 诊断GPS信息
    let gpsStatus = ''
    if (!gpsInfo.raw.latitude && !gpsInfo.raw.longitude) {
      gpsStatus =
        '照片中没有GPS信息。可能的原因：\n1. 拍摄时未开启定位\n2. 相机不支持GPS\n3. 照片已被编辑或压缩'
    } else if (!gpsInfo.processed.latitude || !gpsInfo.processed.longitude) {
      gpsStatus =
        'GPS数据存在但无法解析。原始数据：' +
        JSON.stringify(gpsInfo.raw, null, 2)
    }

    // 整理数据结构
    exifData.value = {
      image: {
        Make: tags.Make,
        Model: tags.Model
      },
      exif: {
        ISO: tags.ISO,
        FNumber: tags.FNumber,
        DateTimeOriginal: tags.DateTimeOriginal
      },
      gps: gpsInfo.available
        ? {
            latitude: gpsInfo.processed.latitude,
            longitude: gpsInfo.processed.longitude,
            raw: gpsInfo.raw // 保存原始数据以备调试
          }
        : null,
      diagnostics: {
        // 添加诊断信息
        fileType: selectedFile.value.type,
        fileSize: selectedFile.value.size,
        hasExif: !!tags,
        gpsStatus
      }
    }

    // 如果有GPS数据但解析失败
    if (gpsStatus) {
      console.warn('GPS状态:', gpsStatus)
      error.value = gpsStatus
    }
  } catch (err) {
    console.error('EXIF读取错误:', err)
    error.value = `读取失败: ${err.message}`
    exifData.value = null
  } finally {
    loading.value = false
  }
}

// 格式化坐标为度分秒格式
const formatCoordinate = (decimal, direction) => {
  if (decimal === undefined) return ''

  const absolute = Math.abs(decimal)
  const degrees = Math.floor(absolute)
  const minutes = Math.floor((absolute - degrees) * 60)
  const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2)

  const dir =
    direction === 'NS' ? (decimal >= 0 ? 'N' : 'S') : decimal >= 0 ? 'E' : 'W'

  return `${degrees}° ${minutes}' ${seconds}" ${dir}`
}

const hasExifData = computed(() => {
  if (!exifData.value) return false
  const data = exifData.value
  return !!(
    data.image?.Make ||
    data.image?.Model ||
    data.exif?.ISO ||
    data.exif?.FNumber ||
    data.exif?.DateTimeOriginal ||
    (data.gps?.latitude !== undefined && data.gps?.longitude !== undefined)
  )
})

// 获取Google地图链接
const getGoogleMapsUrl = computed(() => {
  if (!exifData.value?.gps?.latitude || !exifData.value?.gps?.longitude)
    return '#'
  return `https://www.google.com/maps?q=${exifData.value.gps.latitude},${exifData.value.gps.longitude}`
})

// 获取百度地图链接
const getBaiduMapsUrl = computed(() => {
  if (!exifData.value?.gps?.latitude || !exifData.value?.gps?.longitude)
    return '#'
  return `https://api.map.baidu.com/marker?location=${exifData.value.gps.latitude},${exifData.value.gps.longitude}&title=照片拍摄地点&content=EXIF位置信息&output=html`
})

const resetState = () => {
  selectedFile.value = null
  imageData.value = null
  exifData.value = null
  error.value = null
  loading.value = false
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
