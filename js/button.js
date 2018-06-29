{
    let view = {
        el:'footer > .button',
        init(){
            this.$el = $(this.el);
        },
        active(e){
            let $button = $(e.currentTarget);
            $button.addClass('active').siblings().removeClass('active');
            var index = $button.index();
            $('section').removeClass('active').eq(index).addClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.init();
            this.bindEvent();
        },
        bindEvent(){
            this.view.$el.on('click',(e)=>{
                this.view.active(e);
                $(window).scrollTop(0);
            })
        }
    }
    controller.init(view,model);
}