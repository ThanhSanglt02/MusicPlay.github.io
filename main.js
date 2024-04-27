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

const PLAYER_STORAGE_KEY = JSON.stringify("F8_PLAYER");

const playlist = $('.playlist');
const player = $('.player');
const cd = $('.cd');

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    ispPlaying: false,
    isRandom:  false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},  //localStorage sử dụng JSON
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
    setConfig: function(key,value) {
        this.config[key] = value;  //config ban đầu là object có key được gán giá trị bằng value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config)) //localStorage.setItem(key,value);
    },
    render: function() {
        const htmls = this.songs.map(function(song,index) {
            return `
                <div class="song ${index === app.currentIndex ? 'active': ''}" data-index="${index}">
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
        playlist.innerHTML = htmls.join('');
    },
    
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function() {  // trong việc lắng nghe sự kiện thì ko được sử dụng this
        const _this = this;
        const cdwidth = cd.offsetWidth;

        //Xử lý CD quay / dừng
        cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000, 
            iterations:Infinity    //Lặp lại bao nhiêu lần
        })
        cdThumbAnimate.pause();

        //xử lý phóng to thu nhỏ cd
        document.onscroll = function(e) {
            // console.log(document.documentElement.scrollTop)
            const scrollTop = window.scrollY || document.documentElement.scrollTop
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

        //Lắng nghe sự kiện song được play và đổi incon
        audio.onplay = function() {
            _this.ispPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Lắng nghe sự kiện song bị pause
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
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        
        // Khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Khi click button random bật tắt
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom 
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //Xử lý btn repeat song bật / tắt
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //Xử lý next song khi audio ended / repeat
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();  //trình duyệt tự bấm không cần tác động user
            }
        }

        //Lắng nghe hành vi click vào chọn bài hát
        playlist.onclick = function(e) {
            // console.log(e.target)  //target có nghĩa là khi click vào bất cứ thành phần nào trong playlist thì nó sẽ hiện ra cái thằng đó
            const songNode = e.target.closest('.song:not(.active');
            // xử lý khi click vào song
            if (songNode || e.target.closest('.option')) {  //closest trả về element chính nó hoặc thẻ cha của nó
                if (songNode) {
                    // console.log(songNode.getAttribute('data-index'))
                    // console.log(songNode.dataset.index)
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                    _this.scrollToActiveSong();
                }
            }
        }
    },

    // xử lý view active chạy đến đâu
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 500)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
        this.setConfig('currentIndex', this.currentIndex);
        // audio.innerHTML = `<source src="${this.currentSong.path}">`;
        // console.log(this.currentSong.path)
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {  
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
            if (!this.songArrayIdex.includes(newIndex)) {
                this.songArrayIdex.push(newIndex); 
            }
        } while (newIndex === this.currentIndex);   
        this.currentIndex = newIndex
        this.loadCurrentSong();
    },
    start: function() {

        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

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

        //Hiển thị trạng thái ban đầu của btn repeat và random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}
app.start()