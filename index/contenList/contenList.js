// 商家详情的模板字符串
(function(){
    var itemTmpl = '<div class="r-item-content">'+
        '<img class="item-img" src="$pic_url" />'+
        '$brand'+
        '<a class="item-info">'+
        // 标题
        '<p class="item-title">$name</p>'+
        // 第二行
        '<div class="item-desc clearfix">'+
        '<div class="item-score">$wm_poi_score</div>'+
        '<div class="item-count">月售$monthNmu&nbsp;&nbsp;</div>'+
        '<div class="item-distance">&nbsp;$distance</div>'+
        '<div class="item-time">$mt_delivery_time&nbsp;|</div>'+
        '</div>'+
        // 第三行
        '<div class="item-price">'+
              '<div class="item-pre-price">$min_price_tip</div>'+
        '</div>'+
        // 最后一行
       '<div class="item-others">'+
           '$others'+
           '</div>'+
        '</div>'+
    '</div>';

    var page = 0;
    var isLoading = false;
    // 获取商家列表数据
    function getList() {
        page++;
        isLoading = true;
        $.get('../json/homelist.json',function (data) {
            console.log(data);
            var list = data.data.poilist || [];
            initContentList(list);
            isLoading = false;
        })
    }
    // 渲染是否是新到的还是热门的
function getBrand(data) {
if (data.brand_type){
    return "<div class='brand brand-pin'>hot</div>"
}else{
    return "<div class='brand brand-xin'>new</div>"
}
}
// 渲染月售
    function getMounth(data) {
     var num = data.month_sale_num;
     if (num > 999){
         return '999+';
     }

     return num;
    }
    // others
    function getOThers(data) {
        var array = data.discounts2;
        var str = '';
        array.forEach(function (item,index) {
            //内部的商家活动模板字符串
            var _str = '<div class="other-info">'+
            '<img src="$icon_url" class="other-tag" />'+
            '<p class="other-content one-line">$info</p>'+
            '</div>';
            //内部的商家活动字符串替换
            _str = _str.replace("$icon_url",item.icon_url)
                .replace("$info",item.info);
            //字符串拼接
            str = str +_str;


        })

        return str;
    }
    // 渲染列表数据
    function initContentList(list) {
        list.forEach(function (item,index) {
            var str = itemTmpl
                .replace('$pic_url',item.pic_url)
                .replace('$name',item.name)
                .replace('$distance',item.distance)
                .replace('$min_price_tip',item.min_price_tip)
                .replace('$mt_delivery_time',item.mt_delivery_time)
                 // 品牌比较难
                .replace('$brand',getBrand(item))
                // 月售
              .replace('$monthNmu',getMounth(item))
               .replace('$others',getOThers(item))
            // 最复杂的星星组件
        .replace('$wm_poi_score', new StarScore(item.wm_poi_score).getStars());

            $('.list-wrap').append($(str));
        })


    }

    function addEvent() {
        window.addEventListener('scroll',function () {
            var clientHeight = document.documentElement.clientHeight;
            var scrollHeight = document.body.scrollHeight;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
// 提前量
        var proDis =30;
        if ((scrollTop + clientHeight)>=scrollHeight-proDis) {
            // 最多滚动加载3页
            if (page<1){
                // 在发送ajax请求时避免触发多次滚动加载
                if (isLoading){
                    return;
                }
                getList();
            }else{
                $('.loading').text('加载完成');
            }

        }


        })
    }
    function addClick() {
        $('.list-content').on('click','.item-title',function () {
           console.log($(this).text());
           if($(this).text()==="小哥好滋味"){
               $(window).attr('location','https://sryhdmcw.github.io/test2/menu/menu.html');
           }
        });
    }
    function init() {
        getList();
        addEvent();
        addClick();
    }
init();
})();
