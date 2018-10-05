<template>
    <div id="app">
        <my-header></my-header>
        <tab></tab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <player></player>
    </div>
</template>

<script>
    import MyHeader from './components/header/Header'
    import Tab from './components/tab/Tab'
    import Player from './components/player/Player'
    export default {
        name: 'App',
        components: {
            MyHeader,
            Tab,
            Player
        }
    }
</script>

<style scoped lang="stylus">
</style>
