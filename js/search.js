{
    let view = {
        el:'.search',
        init(){
            this.$el = $(this.el);
        },
        template:`
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
        `,
        render(data){
            data.subjects.forEach(function(movie){
                let html = view.template;
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
                    cast2 : movie.casts[1].name || ' ',
                    cast3 : movie.casts[2].name || ' '
                }
                let placeholers = 
                    ['src','title','average',
                    'collectcount','year','genres1','genres2',
                    'directors','cast1','cast2','cast3'
                    ]
                placeholers.map((string)=>{
                    html = html.replace(`__${string}__`,moviedata[string] || '');
                })
                view.$el.append(html);
            });
        },
        onLoading(){
            $('section > div.loading').addClass('active')
        },
        overLoading(){
            $('section > div.loading').removeClass('active')
        },
        clear(){
            $('.search .item').remove();
        }
    }
    let model ={
        data:{

        },
        getData(callback){
            console.log('start')
            controller.view.onLoading();
            $.ajax({
                url:'https://api.douban.com/v2/movie/search',
                type:'GET',
                dataType:'jsonp',
                data:{
                    start:0,
                    count:100,
                    q:controller.keyword
                }
                }).done(function(respone){
                    controller.view.overLoading();
                    callback&&callback(respone)
                }).fail(function(){
                    console.log('error');
                })
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.keyword = '';
            this.view.init();
            this.bindEvent();
        },
        bindEvent(){
            $('.searchBar > button').on('click',()=>{
                  controller.keyword = $('input').val()
                 this.model.getData((data)=>{
                    controller.view.clear();
                    controller.view.render(data)
                })
            })
        }
    }
    controller.init(view,model)
}
