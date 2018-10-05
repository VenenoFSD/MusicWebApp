import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from "./config";
import {shuffle} from "../../common/js/util";

export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    mounted () {
        this.handlePlaylist(this.playlist);
    },
    activated () {
        this.handlePlaylist(this.playlist);
    },
    watch: {
        playlist (newVal) {
            this.handlePlaylist(this.playlist);
        }
    },
    methods: {
        handlePlaylist () {
            throw new Error('component must implement handlePlaylist method');
        }
    }
};

export const playerMixin = {
    computed: {
        ...mapGetters([
            'playlist',
            'currentSong',
            'currentIndex',
            'mode',
            'sequenceList',
            'favoriteList'
        ]),
        iconMode () {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
        }
    },
    methods: {
        changeMode () {
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode);
            let list = null;
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList);
            } else {
                list = this.sequenceList;
            }
            this.resetCurrentIndex(list);
            this.setPlayList(list);
        },
        resetCurrentIndex (list) {
            //  更改播放模式时，currentSong会随playlist改变而改变【非期望】，因此要改变index使得currentSong不变
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id;
            });
            this.setCurrentIndex(index);
        },
        getFavoriteIcon (currentSong) {
            return this.isFavorite(currentSong) ? 'icon-favorite' : 'icon-not-favorite';
        },
        toggleFavorite (currentSong) {
            if (this.isFavorite(currentSong)) {
                this.deleteFavoriteList(currentSong);
            } else {
                this.saveFavoriteList(currentSong);
            }
        },
        isFavorite (song) {
            const index = this.favoriteList.findIndex((item) => {
                return item.id === song.id;
            });
            return index > -1;
        },
        ...mapMutations({
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST'
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList'
        ])
    }
};

export const searchMixin = {
    data () {
        return {
            query: '',
            refreshDelay: 100
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        addQuery (query) {
            this.$refs.searchBox.setQuery(query);
        },
        onQueryChange (query) {
            this.query = query;
        },
        blurInput () {
            this.$refs.searchBox.blur();
        },
        saveSearch () {
            this.saveSearchHistory(this.query);
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory'
        ])
    }
};
