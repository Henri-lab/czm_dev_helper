<template>
  <div class="login-form">
    <div class="header">
      <h3 class="title">CesiumHelper v1.0.0</h3>
      <h3 class="title title1">欢迎回来,请登陆您的账户</h3>
    </div>
    <a-form class="container" ref="loginRef" :form="form" :rules="loginRules">
      <!-- 用户名 -->
      <a-form-item name="username" :rules="loginRules.username">
        <a-input v-model:value="loginForm.username" placeholder="Username">
        </a-input>
      </a-form-item>
      <!-- 密码 -->
      <a-form-item name="password" :rules="loginRules.password">
        <a-input v-model:value="loginForm.password" type="password" placeholder="Password">
        </a-input>
      </a-form-item>
      <!-- 验证码 -->
      <a-form-item name="code" v-if="captchaEnabled">
        <a-input v-model:value="loginForm.code" size="large" placeholder="验证码" style="width: 63%"
          @keyup.enter="handleLogin" />
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </a-form-item>
      <!-- 记住我 -->
      <a-form-item name="rememberMe">
        <a-checkbox v-model:checked="loginForm.rememberMe">记住密码</a-checkbox>
      </a-form-item>
      <!-- 登录按钮 -->
      <a-form-item class="login-submit" style="width: 100px; margin: 10px auto">
        <a-button :loading="loading" size="large" type="primary" style="width: 100px" @click.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </a-button>
        <div style="float: right" v-if="register">
          <router-link class="link-type" to="/register">立即注册</router-link>
        </div>
      </a-form-item>
    </a-form>
    <div class="footer">
      <span>repo: https://github.com/Henri-lab/czm_dev_helper</span>
    </div>
  </div>
</template>

<script setup>
// import { getCodeImg } from '@/api/auth';
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/util/jsencrypt';
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
      validator: () => validUserName,//arrow func 解决 :ReferenceError: Cannot access 'validUserName' before initialization
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入您的密码',
      validator: () => validPass,
    },
  ],
  code: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入验证码',
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
.login-form {
  width: 90%;
  height: 60%;
  left: 5%;
  padding: 20px 10px 20px 10px;

  .header {
    width: 100%;
    height: 40%;
    position: relative;
    color: black;
    padding: 10px 5px 10px 5px;

    .title {
      width: 100%;
      height: 20%;
      // overflow: scroll;
      font-size: 20px;
    }

    .title1 {
      width: 100%;
      height: 80%;
      // overflow: scroll;
      font-size: 12px;
    }
  }

  .container {
    width: 100%;
    height: 50%;
    padding: 10px 5px 10px 5px;
    position: relative;

    .login-submit {
      position: absolute;
      bottom: -18%;

    }
  }

  .footer {
    width: 100%;
    height: 10%;
    position: absolute;
    bottom: -5%;
    left: 5%;
    font-size: 12px;
  }
}
</style>
