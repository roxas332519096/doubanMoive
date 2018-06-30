{
    let view = {
        el:'.us',
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
            var date = data.date;
            var dateHtml = `<h1>__date__</h1>`;
            dateHtml = dateHtml.replace(`__date__`,date);
            $('.header').append(dateHtml);
            data.subjects.forEach(function(movie){
                let html = view.template;
                let moviedata = {
                    link : movie.subject.alt,
                    src : movie.subject.images.small,
                    title : movie.subject.title,
                    average : movie.subject.rating.average,
                    collectcount : movie.subject.collect_count,
                    year : movie.subject.year,
                    genres1 : movie.subject.genres[0],
                    genres2 : movie.subject.genres[1],
                }
                moviedata.directors = function(){
                    let directors = ''
                    if(movie.subject.directors[0]){
                        directors = movie.subject.directors[0].name
                    }
                    return directors
                }
                moviedata.cast1 = function(){
                    let cast1 = ''
                    if(movie.subject.casts[0]){
                        cast1 = movie.subject.casts[0].name
                    }
                    return cast1
                }
                moviedata.cast2 = function(){
                    let cast2 = ''
                    if(movie.subject.casts[1]){
                        cast2 = movie.subject.casts[1].name
                    }
                    return cast2
                }
                moviedata.cast3 = function(){
                    let cast3 = ''
                    if(movie.subject.casts[2]){
                        cast2 = movie.subject.casts[2].name
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
                view.$el.append(html);
            });
        },
    }
    let model ={
        data:{

        },
        getData(callback){
            $.ajax({
                url:'https://api.douban.com/v2/movie/us_box',
                type:'GET',
                dataType:'jsonp'
                }).done(function(respone){
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
            this.view.init();
            this.model.getData((data)=>{
                controller.view.render(data)
            })
        },
    }
    controller.init(view,model)
}
