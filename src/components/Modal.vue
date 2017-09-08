<template>
    <div>
        <el-dialog
            title="提示"
            :visible.sync="loginAddCart"
            size="tiny"
            :before-close="handleClose"
            >
            <p class="confirm-tips">
                <slot name="message"></slot>
            </p>
            <div class="btn-wrap">
                <slot name="btnGroup"></slot>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  props: ['loginAddCart'],
  data() {
    return {};
  },
  methods: {
    handleClose() {
      this.$emit('closeDialog');
    }
  }
};
</script>

<style>
    .confirm-tips{
        margin-bottom: 20px;
        text-align: center;
    }
    .btn-wrap{
        text-align: center;
        padding-top: 20px;
    }
</style>
