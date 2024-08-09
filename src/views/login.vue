<template>
  <div class="login">
    <a-form ref="loginRef" :form="form" :rules="loginRules" class="login-form">
      <h3 class="title">Cesium工具集@henriFox</h3>
      <h3 class="title1">欢迎登陆</h3>
      <a-form-item name="用户名" :rules="loginRules.username">
        <a-input v-model:value="loginForm.username" placeholder="Username">
          <template #prefix
            ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item name="密码" :rules="loginRules.password">
        <a-input
          v-model:value="loginForm.password"
          type="password"
          placeholder="Password"
        >
          <template #prefix
            ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <!-- Uncomment if you want to use a captcha -->
      <!--
      <a-form-item
        name="code"
        v-if="captchaEnabled"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <a-input
          v-model:value="loginForm.code"
          size="large"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin"
          prefix-icon={<svg-icon icon-class="validCode" class="ant-input-prefix-icon" />}
        />
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </a-form-item>
      -->
      <!-- Uncomment if you want to use remember me -->
      <!--
      <a-form-item
        name="rememberMe"
      >
        <a-checkbox v-model:checked="loginForm.rememberMe">记住密码</a-checkbox>
      </a-form-item>
      -->
      <a-form-item style="width: 300px; margin: 10px auto">
        <a-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 300px"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </a-button>
        <div style="float: right" v-if="register">
          <router-link class="link-type" to="/register">立即注册</router-link>
        </div>
      </a-form-item>
    </a-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <!-- <span>Copyright © 2018-2023 ruoyi.vip All Rights Reserved.</span> -->
    </div>
  </div>
</template>

<script setup>
import { getCodeImg } from '@/api/login';
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import useUserStore from '@/store/modules/user';
import Path from '@/router/path';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

// 登录加载状态
const loading = ref(false);

// 登录Cookie保存时长  7 days
const expires = 7;
// 处理登录点击事件
function handleLogin() {
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loading.value = true; //加载条进行🔄...
      if (loginForm.value.rememberMe) {
        //若勾选记住用户则进行cookie缓存
        Cookies.set('username', loginForm.value.username, { expires });
        Cookies.set('password', encrypt(loginForm.value.password), { expires });
      } else {
        // 否则更新用户的cookie
        Cookies.remove('username');
        Cookies.remove('password');
        Cookies.set('username', loginForm.value.username, { expires });
        Cookies.set('password', encrypt(loginForm.value.password), { expires });
      }
      userStore
        .login(loginForm.value)
        .then(() => {
          router.push({
            path: Path.afterLogin,
          });
        })
        .catch(() => {
          loading.value = false; //加载条结束✅
          if (captchaEnabled.value) {
            getCode();
          }
        });
    }
  });
}

// 表单数据
const loginForm = ref({
  username: 'admin',
  password: 'admin123',
  rememberMe: false,
  code: '',
  uuid: '',
});

// 表单验证
const loginRules = {
  username: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入您的账号',
      validator: validUserName,
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入您的密码',
      validator: validPass,
    },
  ],
};
// 规则
const validUserName = (rule, name) => {
  if (name === '') {
    return Promise.reject('用户名不能为空');
  } else {
    return Promise.resolve();
  }
};
const validPass = (rule, pw) => {
  if (pw === '') {
    return Promise.reject('密码不能为空');
  } else {
    return Promise.resolve();
  }
};

// 验证码CAPTCHA ~ Completely Automated Public Turing test to tell Computers and Humans Apart
const codeUrl = ref('');
// 验证码开关
const captchaEnabled = ref(true);
// 注册开关
const register = ref(false);
// const redirect = ref(undefined);

// watch(
//   route,
//   (newRoute) => {
//     redirect.value = newRoute.query && newRoute.query.redirect;
//   },
//   { immediate: true }
// );

// 获得验证码
function getCode() {
  getCodeImg().then((res) => {
    captchaEnabled.value =
      res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = 'data:image/gif;base64,' + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
}

// 获得cookie
function getCookie() {
  const username = Cookies.get('username');
  const password = Cookies.get('password');
  const rememberMe = Cookies.get('rememberMe');
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  };
}

// getCode();
getCookie();
</script>

<style lang="scss" scoped>
.el-form {
  width: 609px !important;
  height: 507px;
  background: url('@/assets/images/登录框.png') no-repeat center !important;
  background-size: cover !important;
  position: relative;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('@/assets/images/背景.png');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #ffff;
  position: fixed;
  font-size: 30px;
  top: 30px;
}
.title1 {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #ffff;
  position: absolute;
  font-size: 22px;
  top: 28px;
}
.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .el-input {
    height: 40px;
    width: 300px;
    margin: 5px auto;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
    color: #a0d6f0;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
<style>
.el-input__wrapper {
  background: none;
  box-shadow: none;
  border: 1px solid #194d83;
}
.el-input__inner {
  color: #ffff;
}
.is-focus {
  box-shadow: none !important;
}
</style>
