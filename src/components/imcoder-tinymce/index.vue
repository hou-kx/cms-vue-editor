<template>
  <div class="tinymce-container" :style="{ width: containerWidth }">
    <textarea :id="editorId" class="tinymce-textarea" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import tinymce from "tinymce/tinymce";
import { contentStyle, plugins } from "./plugin";
import { toolbar } from "./toolbar";

// 接收 props
const props = defineProps({
  value: {
    type: String,
    default: ""
  },
  opt: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  },
  menubar: {
    type: String,
    default: "file edit insert view format table"
  },
  height: {
    type: [Number, String],
    required: false,
    default: 400
  },
  width: {
    type: [Number, String],
    required: false,
    default: "auto"
  }
});

const containerWidth = () => {
  const width = props.width;
  if (/^[\d]+(\.[\d]+)?$/.test(width)) {
    // matches `100`, `'100'`
    return `${width}px`;
  }
  return width;
};

// 定义事件
const emit = defineEmits(["input"]);

// 生成唯一 ID
const editorId = `editor-${Math.floor(Math.random() * 1000000)}`;
const editor = ref(null);

// 初始化编辑器
const init = () => {
  const defaultOptions = {
    selector: "#" + editorId,
    language: "zh_CN",
    menubar: props.menubar,
    plugins: plugins,
    toolbar: toolbar,
    toolbar_mode: "wrap",
    height: props.height,
    skin: false,
    content_css: false,
    content_style: contentStyle,
    // automatic_uploads: true,
    code_dialog_height: 450,
    code_dialog_width: 1000,
    end_container_on_empty_block: true,
    powerpaste_word_import: "clean",
    paste_data_images: true, //允许粘贴base64图片
    paste_enable_default_filters: false, //word文本设置
    file_picker_types: "image",
    advlist_bullet_styles: "default,circle,disc,square",
    default_link_target: "_blank",
    link_title: true,
    fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
    font_formats:
      "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
    ...props.opt,
    images_upload_handler: (blobInfo, success, failure) => {
      // 示例：上传逻辑（可替换为实际调用）
      // uploadFile({ filename: blobInfo.filename(), blob: blobInfo.blob() })
      //   .then(res => success(res))
      //   .catch(err => failure(err))
      success("https://via.placeholder.com/150"); // 演示用占位图
    },
    setup: ed => {
      editor.value = ed;
      ed.on("init", () => {
        if (props.value) {
          ed.setContent(props.value);
        }
        // 触发 v-model 更新
        ed.on("change keyup undo redo", () => {
          emit("input", ed.getContent());
        });
      });
    }
  };

  tinymce.init(defaultOptions);
};

// 监听 value 变化，同步到编辑器
watch(
  () => props.value,
  (newVal, oldVal) => {
    if (
      editor.value &&
      newVal !== oldVal &&
      newVal !== editor.value.getContent()
    ) {
      editor.value.setContent(newVal);
    }
  }
);

// 监听 disabled 变化
watch(
  () => props.disabled,
  val => {
    if (editor.value) {
      editor.value.setMode(val ? "readonly" : "design");
    }
  }
);

// 生命周期：挂载时初始化
onMounted(() => {
  init();
});

// 生命周期：卸载时销毁
onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy();
    editor.value = null;
  }
});
</script>

<style lang="scss" scope>
// 引入富文本皮肤
@import "/public/tinymce/skins/ui/oxide/skin.css";
</style>
