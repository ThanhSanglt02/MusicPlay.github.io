/*
    1. render songs
    2. scroll top
    3. play / pause/ seek (chạy / dừng / tua)
    4. cd rotate
    5. next / prev
    6. random
    7. next / repeat when ended
    8. active song
    9. scrool active song into view
    10. phay song when click
*/

const $ = document.querySelector.bind(document)
const $$= document.querySelectorAll.bind(document)

const player = $('.player');
const cd = $('.cd');

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
// const audio = $('#audio');
var audio = document.getElementById('audio');

const playBtn = $('.btn-toggle-play');

const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');

const app = {
    currentIndex: 0,
    ispPlaying: false,
    songs: [
        {
            name: 'Seven',
            singer: 'Jungkook',
            path: './assets/music/seven.mp3',
            image: './assets/img/song1.png'
        },
        {
            name: 'Magnetic',
            singer: 'ILLIT',
            path: './assets/music/magnetic.mp3',
            image: './assets/img/img2.png'
        },
        {
            name: "We can't be friend ",
            singer: 'Ariana Grane',
            path: './assets/music/wecantbefriend.mp3',
            image: './assets/img/wecantbefriend.png'
        },    {
            name: 'Zombie Remix',
            singer: 'DJ abc',
            path: './assets/music/zombieremix.mp3',
            image: './assets/img/zombieremix.png'
        },
        {
            name: 'Bad Bye',
            singer: 'WEAN',
            path: './assets/music/badbye.mp3',
            image: './assets/img/badbye.png'
        },
        {
            name: 'Hai Phut Hon Remix',
            singer: 'Phao',
            path: './assets/music/haiphuthon.mp3',
            image: './assets/img/haiphuthon.png'
        },
        {
            name: 'What Is Love',
            singer: 'TWICE',
            path: './assets/music/whatislove.mp3',
            image: './assets/img/whatislove.png'
        },
        {
            name: 'What I Made For',
            singer: 'Billie Eilish',
            path: './assets/music/whatwasimadefor.mp3',
            image: './assets/img/billie.png'
        },
        {
            name: 'Bad Boy English',
            singer: 'Red Velvet',
            path: './assets/music/badboy.mp3',
            image: './assets/img/badboy.png'
        }
    ],
    render: function() {
        const htmls = this.songs.map(function(song) {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {  // trong việc lăngs nghe sự kiện thì ko được sử dụng this
        const _this = this;
        const cdwidth = cd.offsetWidth;

        //Xử lý CD quay / dừng
        cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,  //Để quay 1 vòng thì tốn 10s
            iterations:Infinity    //Lặp lại bao nhiêu lần
        })
        cdThumbAnimate.pause();

        //xử lý phóng to thu nhỏ cd
        document.onscroll = function(e) {
            // console.log(document.documentElement.scrollTop)
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            console.log(scrollTop)
            const newCdWidth = cdwidth - scrollTop;
            // console.log(newCdWidth)
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdwidth;
        }
        //

        //Xử lý khi click play
        playBtn.onclick = function(e) {
            if(_this.ispPlaying) {  //true
                audio.pause();
            }
            else {  //false
                audio.play();
            }
        }

        //Khi song được play 
        audio.onplay = function() {
            _this.ispPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Khi song bị pause
        audio.onpause = function() {
            _this.ispPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
            //audio.duration: là tổng số giây của bài hát
            // console.log(audio.currentTime / audio.duration * 100);  // vì input range lấy giá trị % nên phải nhân với %
        }

        //Xử lý khi tua song
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            // console.log(audio.duration / 100 * e.target.value)
            audio.currentTime = seekTime;
        }

        // Khi next song
        nextBtn.onclick = function() {
            _this.nextSong();
            audio.play();
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
        // audio.innerHTML = `<source src="${this.currentSong.path}">`;
        // console.log(this.currentSong.path)
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentSong = 0
        }
        this.loadCurrentSong()
    },
    start: function() {
        //định nghĩa thuộc tính mới cho object
        this.defineProperties()
        //

        // Lắng nghe và xử lý các sự kiện
        this.handleEvent();
        //

        //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        //

        // Render playlist
        this.render();
        //
    }
}
app.start()