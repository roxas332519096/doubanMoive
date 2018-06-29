{
    let view = {
        el:'.us',
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
            var date = data.date;
            var title = data.title;
            var dateHtml = `<h1>__date__</h1>`;
            var titleHtml = `<h1>__title__</h1>`;
            dateHtml = dateHtml.replace(`__date__`,date);
            titleHtml = titleHtml.replace(`__title__`,title);
            $('.header').append(titleHtml);
            $('.header').append(dateHtml);
            data.subjects.forEach(function(movie){
                let html = view.template;
                let moviedata = {
                    src : movie.subject.images.small,
                    title : movie.subject.title,
                    average : movie.subject.rating.average,
                    collectcount : movie.subject.collect_count,
                    year : movie.subject.year,
                    genres1 : movie.subject.genres[0],
                    genres2 : movie.subject.genres[1],
                    directors : movie.subject.directors[0].name,
                    cast1 : movie.subject.casts[0].name,
                    // cast2 : movie.subject.casts[1].name || ' ',
                    // cast3 : movie.subject.casts[2].name || ' '
                }
                let placeholers = 
                    ['src','title','average',
                    'collectcount','year','genres1','genres2',
                    'directors','cast1','cast2','cast3'
                    ]
                placeholers.map((string)=>{
                    html = html.replace(`__${string}__`,moviedata[string] || '');
                })
                $('.us').append(html);
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
            controller.view.onLoading();
            $.ajax({
                url:'https://api.douban.com/v2/movie/us_box',
                type:'GET',
                dataType:'jsonp'
                }).done(function(respone){
                    callback&&callback(respone)
                }).fail(function(){
                    console.log('error');
                }).always(function(){
                    controller.view.overLoading();
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
