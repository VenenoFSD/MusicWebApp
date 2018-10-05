import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import state from './state'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'productions';

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    //  strict: debug,  //  调试环境下开启严格模式
    plugins: debug ? [createLogger()] : []  //  调试插件
});

//  PS: Vuex一般步骤：在state定义数据 -> 在getters做过滤（计算属性） -> 在mutations-types定义mutations操作名 -> 在mutations对数据进行存储 -> 在actions操作state并commit到mutations
