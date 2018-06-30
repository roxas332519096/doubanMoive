{
    let view = {
        el:'.top250',
        init(){
            this.$el = $(this.el);
        },
        template:`
        <div class="item">
            <a href="__link__">
                <div class="cover">
                    <img src="__src__" alt="">
                </div>
                <div class="detail">
                    <h2>__title__</h2>
                    <div class="extra">评分: <span class="point">__average__</span> /  <span class="leave">__collectcount__人评价</span></div>
                    <div class="extra">__year__ / __genres1__  / __genres2__</div>
                    <div class="extra">导演:__directors__</div>
                    <div class="extra">主演:__cast1__ __cast2__ __cast3__</div>
                </div>
            </a>
        </div>
        `,
        render(data){
            data.subjects.forEach(function(movie){
                let html = view.template;
                let moviedata = {
                    link: movie.alt,
                    src : movie.images.small,
                    title : movie.title,
                    average : movie.rating.average,
                    collectcount : movie.collect_count,
                    year : movie.year,
                    genres1 : movie.genres[0],
                    genres2 : movie.genres[1],
                }
                moviedata.directors = function(){
                    let directors = ''
                    if(movie.directors[0]){
                        directors = movie.directors[0].name
                    }
                    return directors
                }
                moviedata.cast1 = function(){
                    let cast1 = ''
                    if(movie.casts[0]){
                        cast1 = movie.casts[0].name
                    }
                    return cast1
                }
                moviedata.cast2 = function(){
                    let cast2 = ''
                    if(movie.casts[1]){
                        cast2 = movie.casts[1].name
                    }
                    return cast2
                }
                moviedata.cast3 = function(){
                    let cast3 = ''
                    if(movie.casts[2]){
                        cast2 = movie.casts[2].name
                    }
                    return cast3
                }
                let placeholers = 
                    ['link','src','title','average',
                    'collectcount','year','genres1','genres2',
                    'directors','cast1','cast2','cast3'
                    ]
                placeholers.map((string)=>{
                    html = html.replace(`__${string}__`,moviedata[string] || '');
                })
                $('.top250').append(html);
            });
        },
        onLoading(){
            $('section.top > div.loading').addClass('active')
        },
        overLoading(){
            $('section.top > div.loading').removeClass('active')
        }
    }
    let model ={
        data:{

        },
        getData(callback){
            if(controller.isLoading) return;
            controller.isLoading = true;
            controller.view.onLoading();
            $.ajax({
                url:'https://api.douban.com/v2/movie/top250',
                type:'GET',
                data:{
                    start:controller.index,
                    count:20
                },
                dataType:'jsonp'
                }).done(function(respone){
                    controller.index += 20;
                    if(controller.index >= respone.total){
                        controller.isFinish = true;
                    }
                    callback&&callback(respone)
                }).fail(function(){
                    console.log('error');
                }).always(function(){
                    controller.isLoading = false;
                    controller.view.overLoading();
                })
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.isLoading = false;
            this.isFinish = false;
            this.index = 0;
            this.view.init();
            this.model.getData((data)=>{
                controller.view.render(data)
            })
            this.bindEvents();
        },
        bindEvents(){
            $('main').scroll(function(){
                let sectionTop =  $('section.top').height();
                let currentTop = $('main').height() + $('main').scrollTop();
                if(sectionTop - 10 <= currentTop){
                    controller.model.getData((data)=>{
                        controller.view.render(data)
                    })
                }
            })
        }
    }
    controller.init(view,model)
}
