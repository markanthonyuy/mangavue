/**
 * @file main.js of Manga Vue
 * @author Mark Anthony Uy
 * @copyright Manga Vue 2017
 */

'use strict';

Vue.config.devtools = true;
const MANGA_API_URL = 'https://www.mangaeden.com/api/list/0/';
const MANGA_IMAGE_PREFIX_URL = 'https://cdn.mangaeden.com/mangasimg/';
const MANGA_INFO_API_URL = 'https://www.mangaeden.com/api/manga/';
const MANGA_CHAPTER_INFO_API_URL = 'https://www.mangaeden.com/api/chapter/';
const HOT_MANGA = [
  {
    t: 'Shingeki no Kyojin',
    i: '4e70ea6ac092255ef7006a52',
  },
  {
    t: 'Fairy Tail',
    i: '4e70ea1dc092255ef7004d5c'
  },
  {
    t: 'Onepunch-Man',
    i: '5096b789c092254a3301047c'
  },
  {
    t: 'Girls of the Wild\'s',
    i: '4f8d1da994cbc2489b000046'
  },
  {
    t: 'The Moon that Rises in the Day',
    i: '572dde2f719a1687f232d6b1'
  },
  {
    t: 'Helck',
    i: '56816847719a1628fb5351d0'
  },
  {
    t: 'Akatsuki no Yona',
    i: '51a686cc45b9ef1aee6a6116'
  },
  {
    t: 'Boku no Hero Academia',
    i: '541aabc045b9ef49009d69b6'
  },
  {
    t: 'Desolate Era',
    i: '55a6db8e719a162625b32e3a'
  },
  {
    t: 'Aisopos',
    i: '548ab59e45b9effee4d8dc9a'
  },
  {
    t: 'Blood Bank',
    i: '581fa3d7719a166263044880'
  },
  {
    t: 'Boruto: Naruto Next Generations',
    i: '5754a49e719a1641fd988b6d'
  },
  {
    t: 'Vampire Sphere',
    i: '56a01591719a1697fffe0908'
  },
  {
    t: 'Yowamushi Pedal',
    i: '521f380645b9ef97721b2d27'
  },
  {
    t: 'Naruto',
    i: '4e70ea03c092255ef70046f0'
  },
  {
    t: 'Battle Through The Heavens',
    i: '5372380045b9ef5a0b1d1f91'
  },
  {
    t: 'Uragiri wa Boku no Namae wo Shitteiru',
    i: '4e70e9ffc092255ef70045cb'
  },
  {
    t: 'One Piece',
    i: '4e70ea10c092255ef7004aa2'
  },
  {
    t: 'Light vs Shadow',
    i: '5819223e719a164212b6aad8'
  },
  {
    t: 'Bleach',
    i: '4e70e9efc092255ef7004274'
  },
];
// register

Vue.component('main-tabs', {
  props: {
    items: {
      type: Array,
      required: true,
    }
  },

  template: `
    <div class="hero-foot">
      <nav class="tabs is-boxed">
        <div class="container">
          <ul>
            <li v-for="(item, i) in items" :class="{ 'is-active' : tab === i }" @click="switchTab(i)">
              <a>{{ item }}</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  `,

  methods: {
    switchTab(target) {
      this.tab = target;
      if(this.tab === 0) {
        app.getHotMangaList();
      } else if(this.tab === 1) {
        app.getMangaList();
      } 
    }
  },

  data() {
    return {
      tab: 0
    }
  }
});

Vue.component('pagination-info', {
  props: ['page', 'total'],

  template: `
    <article class="message is-primary info">
      <div class="message-body">
        Showing page {{ page }} of {{ total }}
      </div>
    </article>
  `
});

Vue.component('manga-chapter', {
  props: ['images'],

  template: `
    <div class="manga-chapter">
      <div class="" v-if="images.length"> 

        <pagination-info 
          :page="page"
          :total="getTotalPages"></pagination-info>

        <div class="paging field has-addons-centered">
          <button @click="showStarPage" :disabled="startPage" class="button is-success">First</button>
          <button @click="showPrevPage" :disabled="startPage" class="button is-info">Prev</button>
          <span class="select">
            <select v-model="page" @change="jumpPage(page)">
              <option v-for="n in getTotalPages" :value="n">{{ n }}</option>
            </select>
          </span>
          <button @click="showNextPage" :disabled="lastPage" class="button is-info">Next</button>
          <button @click="showEndPage" :disabled="lastPage" class="button is-success">Last</button>
        </div>

        <p class="image"><img :src="showChapterImage(reverseImage[page - 1][1])"></p>

        <div class="paging field has-addons-centered">
          <button @click="showStarPage" :disabled="startPage" class="button is-success">First</button>
          <button @click="showPrevPage" :disabled="startPage" class="button is-info">Prev</button>
          <span class="select">
            <select v-model="page" @change="jumpPage(page)">
              <option v-for="n in getTotalPages" :value="n">{{ n }}</option>
            </select>
          </span>
          <button @click="showNextPage" :disabled="lastPage" class="button is-info">Next</button>
          <button @click="showEndPage" :disabled="lastPage" class="button is-success">Last</button>
        </div>
      </div>
    </div>
  `,

  watch: {
    images() {
      this.reset();
    }
  },

  methods: {
    showChapterImage(id) {
      return MANGA_IMAGE_PREFIX_URL + id;
    },

    showStarPage() {
      this.page = 1;
    },

    showPrevPage() {
      this.page -= 1;
    },

    showNextPage() {
      this.page += 1;
    },

    showEndPage() {
      this.page = this.images.length;
    },

    jumpPage(page) {
      this.page = page;
    },

    reset() {
      Object.assign(this.$data, this.$options.data());
    }
  },

  computed: {
    reverseImage() {
      return this.images.reverse();
    },

    startPage() {
      return this.page === 1; 
    },

    lastPage() {
      return this.page === this.images.length; 
    },

    displayPageNum() {
      return this.images[this.page - 1][0] + 1;
    },

    getTotalPages() {
      return this.images.length;
    }
  },

  data() {
    return {
      chapterImage: null,
      page: 1,
    }
  }
});

Vue.component('manga-information', {
  props: ['status', 'description', 'image', 'title', 'categories', 'author', 'artist', 'chapters'],

  template: `
    <div v-if="title">
      <h2 class="title is-2">{{ title }}</h2>

      <div class="box manga-info-box">
        <article class="media">
          <div class="media-left">
            <figure class="image is-128x128">
              <img v-if="image" :src="image">
              <span v-else="image" class="no-image">No Image Available</span> 
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <div>
                <b v-show="author">Author:</b> <span>{{ author }}</span> <b v-show="artist">Artist:</b> <span>{{ artist }}</span>
                <br>
                <p v-html="description"></p>
              </div>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <span class="tag is-primary category" v-for="category in categories">{{ category }}</span>
              </div>
            </nav>
          </div>
        </article>
      </div>

      <table class="table is-bordered is-narrow" v-show="chapters.length">
        <thead>
          <tr>
            <th>Chapter #</th>
            <th>Title</th>
            <th>Date Release</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(chapter, i) in chapters" @click="showChapter(chapter[3], i, $event)" 
            class="select-chapter" :class="{ 'is-selected': chapterActive === i }">
            <td>{{ chapter[0] }}</td>
            <td>{{ cleanTitle(chapter[2]) }}</td>
            <td>{{ readDate(chapter[1]) }}</td>
            <td>Read</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Chapter #</th>
            <th>Title</th>
            <th>Date Release</th>
            <th>Options</th>
          </tr>
        </tfoot>
      </table>
      <nav class="pagination">
        <a class="pagination-previous" @click="showPrevPage">Previous</a>
        <a class="pagination-next" @click="showNextPage">Next page</a>
      </nav>
    </div>
  `,

  methods: {
    cleanTitle(title) {
      return title ? title : 'No Title';
    },

    buildRef(id) {
      return MANGA_CHAPTER_INFO_API_URL + id;
    },

    readDate(timestamp) {
      var d = new Date(timestamp * 1000), month, day;
      if((d.getMonth() + 1) < 10) {
        month = '0' + (d.getMonth() + 1);
      } else {
        month = d.getMonth() + 1;
      }

      if(d.getDate() < 10) {
        day = '0' + d.getDate();
      } else {
        day = d.getDate();
      }

      return month + ' ' + day + ' ' + d.getFullYear();
    },

    showChapter(id, target, e) {
      var _this = this;

      if(typeof this.cancelMangaChapterCall === 'function') {
        this.cancelMangaChapterCall('Canceled Manga information Promise Call');
      }

      this.chapterActive = target;

      axios.get(encodeURIComponent(MANGA_CHAPTER_INFO_API_URL + id), {
        cancelToken: new CancelToken(function(c) {
          // An executor function receives a cancel function as a parameter
          _this.cancelMangaChapterCall = c;
        })
      })
      .then(function(res) {
        console.log(res);
        app.chapterImage = res.data.images;
        app.chapterCurrentPage = 1;
      })
      .catch(function(error) {
        console.log(error);
      });
    },

    showPrevPage() {
      
    },

    showNextPage() {

    },
  },

  computed: {
    reverseChapters() {
      return this.chapters.reverse();
    },

    limitChapters(start = 0, count = 10) {
      return this.chapters.slice(start, count);
    }
  },

  data() {
    return {
      cancelMangaChapterCall: null,
      chapterActive: null
    }
  }
});

/*Vue.component('manga', {
  template: `<li v-on:click="showMangaInfo"><slot></slot></li>`,

  methods: {
    showMangaInfo() {
      console.log('Showing manga information');
    }
  }
});*/

Vue.component('manga-list', {
  props: {
    mangas: { required: true },
    activeid: null,
  },

  template: `
    <div class="manga-list-wrap">
      <ul class="manga-list">
        <li v-for="(manga, i) in mangas">
          <span @click.self="showMangaInfo(manga, i, $event)" :class="{ 'active': mangaActive === i }" class="manga-name">{{ manga.t }}</span>
          <br>
          <!-- manga.ims does not exists therefore it will not get rendered to get rendered change to manga.im -->
          <img v-if="manga.ims" :src="buildMangaImageURL(manga.im)" class="manga-list-image">
        </li>
      </ul>
    </div>
  `,

  mounted() {
  },

  methods: {

    showMangaInfo(manga, target, e) {
      if(this.activeid === manga.i) return; // Don't do anything if the selected manga is clicked again.

      var _this = this;

      this.mangaActive = target;

      if(typeof this.cancelMangaInfoCall === 'function') {
        this.cancelMangaInfoCall('Canceled Manga information Promise Call');
      }

      app.activeMangaId = manga.i; // Save active manga id for future reference

      axios.get(encodeURIComponent(MANGA_INFO_API_URL + manga.i), {
        cancelToken: new CancelToken(function(c) {
          // An executor function receives a cancel function as a parameter
          _this.cancelMangaInfoCall = c;
        })
      })
      .then(function (res) {
        console.log(res);
        app.mangaTitle = res.data.title;
        app.mangaAuthor = res.data.author;
        app.mangaArtist = res.data.artist;
        app.mangaDesc = res.data.description;
        app.mangaStatus = res.data.status;
        app.mangaImg = res.data.image ? MANGA_IMAGE_PREFIX_URL + res.data.image : null;
        app.mangaCat = res.data.categories;
        app.mangaChapters = res.data.chapters;
        app.chapterImage = [];
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    buildMangaImageURL(id) {
      return MANGA_IMAGE_PREFIX_URL + id;
    },

    // Check if active manga is currently in the list and applied active class
    isActive(id) {
      return { 'active': this.activeid === id }
    }
  },

  computed: {
  },

  data() {
    return {
      mangaActive: null
    }
  }
});

function isObject(obj) {
  return obj === Object(obj);
}

var CancelToken = axios.CancelToken;

var app = new Vue({
  el: '#app',

  data: {
    message: 'Welcome to Manga Vue',
    subMessage: 'Free, fast, simple and straightforward Manga Reader',
    mangas: [],
    isMangaClicked: false,
    start: true,
    last: false,
    page: 1,
    length: 60,
    total: 17247,
    cancelMangalistCall: null,
    cancelMangaInfoCall: null,
    mangaStatus: '',
    mangaTitle: '',
    mangaAuthor: '',
    mangaArtist: '',
    mangaDesc: '',
    mangaImg: '',
    mangaCat: [],
    mangaChapters: [],
    activeMangaId: null,
    chapterImage: [],
    chapterCurrentPage: 1,
  },

  mounted() {
    var _this = this;
    this.getHotMangaList();
  },

  methods: {

    // Prevent this.page to be equals 0
    getSafePage() {
      var safePage;

      if(this.page === 1) {
        safePage = 0;
      } else if(this.page === 0) {
        this.page = 1;
        safePage = 0;
      } else {
        safePage = this.page - 1;
      }

      return safePage;
    },

    getHotMangaList() {
      this.mangas = HOT_MANGA;
      this.total = HOT_MANGA.length;
    },

    getMangaList() {
      var _this = this;

      if(typeof this.cancelMangalistCall === 'function') {
        this.cancelMangalistCall('Canceled Manga List Promise Call');
      }

      axios.get(encodeURIComponent(MANGA_API_URL + '?p=' + this.getSafePage() + '&l=' + this.length), {
        cancelToken: new CancelToken(function(c) {
          // An executor function receives a cancel function as a parameter
          _this.cancelMangalistCall = c;
        })
      }).then(function (res) {
        _this.mangas = res.data.manga;
        _this.total = res.data.total;
        _this.mangaTitle = '';
        _this.mangaAuthor = '';
        _this.mangaArtist = '';
        _this.mangaDesc = '';
        _this.mangaStatus = '';
        _this.mangaImg = null;
        _this.mangaCat = '';
        _this.mangaChapters = [];
        _this.chapterImage = [];
      }).catch(function (error) {
        console.log(error);
        if(axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          // handle error
        }
      });
    },

    showStarPage() {
      this.page = 1
      this.getMangaList();
    },

    showPrevPage() {
      this.page = parseInt(this.page - 1);
      this.getMangaList();
      console.log(this.page);
    },

    jumpPage(page) {
      this.page = page;
      this.getMangaList();
    },

    showNextPage() {
      this.page = parseInt(this.page + 1);
      this.getMangaList();
      console.log(this.page);
    },

    showEndPage() {
      this.page = Math.floor(this.total / this.length);
      this.getMangaList();
    },
  },

  computed: {
    getTotalPages() {
      return Math.ceil(this.total / this.length);
    },

    startPage() {
      return this.page === 1;
    },

    endPage() {
      return (this.page + 1) >= this.total / this.length;
    },
  }
});
