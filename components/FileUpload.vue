<template>
  <div class="file-upload">
    <!-- 隐藏的文件输入框 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />

    <v-btn color="primary" icon="mdi-file-upload"></v-btn>
    <!-- 自定义上传按钮 -->
    <v-btn class="select-btn" :disabled="uploading" @click="triggerFileSelect">
      选择文件
    </v-btn>

    <!-- 文件信息 -->
    <div v-if="fileName" class="file-info">
      <span>{{ fileName }}</span>
      <button class="upload-btn" :disabled="uploading" @click="upload">
        {{ uploading ? '上传中...' : '上传' }}
      </button>
      <button class="clear-btn" :disabled="uploading" @click="clearFile">
        清除
      </button>
    </div>

    <!-- 上传结果 -->
    <div v-if="fileUrl" class="result">上传成功: {{ fileUrl }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const fileInput = ref(null)
const selectedFile = ref(null)
const fileName = ref('')
const fileUrl = ref('')
const uploading = ref(false)

// 触发文件选择
function triggerFileSelect() {
  fileInput.value.click()
}

// 处理文件选择
function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    clearFile()
    return
  }

  // 验证文件大小 (2MB限制)
  if (file.size > 2 * 1024 * 1024) {
    alert('文件大小不能超过2MB')
    clearFile()
    return
  }

  selectedFile.value = file
  fileName.value = file.name
}

// 清除选择的文件
function clearFile() {
  fileInput.value.value = ''
  selectedFile.value = null
  fileName.value = ''
}

// 上传文件
async function upload() {
  if (!selectedFile.value) {
    alert('请先选择文件')
    return
  }
  try {
    uploading.value = true

    // 创建FormData
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    // 调用API进行上传，使用自定义请求头
    const response = await fetch('http://localhost:9000/upload/file', {
      method: 'POST',
      body: formData
    })

    console.log('上传结果:', response)

    if (response.ok) {
      alert('上传成功')
    } else {
      alert('上传失败: ' + response.ErrMsg)
    }
  } catch (error) {
    console.error('上传错误:', error)
    alert('上传失败')
  } finally {
    uploading.value = false
  }
}

// 导出文件URL，供父组件使用
defineExpose({
  fileUrl
})
</script>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.select-btn {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: fit-content;
}

.select-btn:hover {
  background-color: #66b1ff;
}

.select-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.upload-btn {
  padding: 4px 8px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn {
  padding: 4px 8px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-btn:disabled,
.clear-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result {
  margin-top: 10px;
  padding: 8px;
  background-color: #f0f9eb;
  color: #67c23a;
  border-radius: 4px;
  word-break: break-all;
}
</style>
