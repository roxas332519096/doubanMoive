var index = 0;
var isLoading = false;
getData();

$('main').scroll(function(){
    let sectionTop =  $('section.top').height();
    let currentTop = $('main').height() + $('main').scrollTop();
    if(sectionTop - 10 <= currentTop){
        getData();
    }
})

function getData(){
    if(isLoading) return
    isLoading = true;
    console.log('loading动画出现')
    $('section.top > div.loading').addClass('active');
    $.ajax({
    url:'https://api.douban.com/v2/movie/top250',
    type:'GET',
    data:{
        start:index,
        count:20
    },
    dataType:'jsonp'
    }).done(function(respone){
        setData(respone);
        index += 20;
    }).fail(function(){
        console.log('error');
    }).always(function(){
        isLoading = false;
        console.log('loading动画消失')
        $('section.top > div.loading').removeClass('active');
    })
}
function setData(respone){
    respone.subjects.forEach(function(movie){
        let template = `
        <div class="item">
            <a href="#">
                <div class="cover">
                    <img src="__src__" alt="">
                </div>
                <div class="detail">
                    <h2>__title__</h2>
                    <div class="extra">__average__ / __collectcount__</div>
                    <div class="extra">__year__ / __genres1__  / __genres2__</div>
                    <div class="extra">导演:__directors__</div>
                    <div class="extra">主演:__cast1__ __cast2__ __cast3__</div>
                </div>
            </a>
        </div>
        `
        let html = template;
        // let src = 'https://images.weserv.nl/?url=' + movie.images.small.slice(6)
        let moviedata = {
            src : movie.images.small,
            title : movie.title,
            average : movie.rating.average,
            collectcount : movie.collect_count,
            year : movie.year,
            genres1 : movie.genres[0],
            genres2 : movie.genres[1],
            directors : movie.directors[0].name,
            cast1 : movie.casts[0].name,
            cast2 : movie.casts[1].name,
            cast3 : movie.casts[2].name
        }
        let placeholers = 
            ['src','title','average',
            'collectcount','year','genres1','genres2',
            'directors','cast1','cast2','cast3'
            ]
        placeholers.map((string)=>{
            html = html.replace(`__${string}__`,moviedata[string] || '');
        })
        $('.top250').append(html);
    });
}

