import axios from 'axios';
import { Loading, Message, Notification } from 'element-ui';
import router from './router'

let loading;
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '系统正在加载……',
        background: 'rgb(0,0,0,0,7)'
    });
}

function endLoading() {
    loading.close();
}

//请求拦截
axios.interceptors.request.use(
    config => {
        //加载动画
        startLoading();

        //拦截后设置请求头
        if(localStorage.eleToken) {
            config.headers.Authorization = 'JWT ' + localStorage.eleToken;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
//响应拦截
axios.interceptors.response.use(
    response => {
      endLoading();
      return response;
    },
    error => {
      endLoading();
      console.log('error');
      let code = error.response.status;
      let errmsg = error.response.data
      if(code == 401) {
        Notification.warning({
          title: '超时',
          message: '登陆超时，请重新登陆!'
        })
        router.push('/login')
      } else if(code == 400) {
        Notification.error({
          title: '请求错误',
          message: errmsg
        })
      }else if (code >= 500) {
        Notification.error({
          title: '服务器错误',
          message: '服务器错误，请联系运维!'
        })
      }
      return Promise.reject(error);
    }
);


export default axios;
