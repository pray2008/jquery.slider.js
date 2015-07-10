# jquery.slider.js
This is a jquery plugin that can be easily used to slide several pictures in a container or switch pictures automatically. 
It is desgined for mobile page, but can also be used in IE9+, chrome, ff

The way to use it:
<div class="my_slidder"></div>

<script>
var slider = $(".my_slidder").slider({
    data: [
        {
            img: "https://dn-maimoney.qbox.me/img/index/banner/banner7.992d.jpg",
            title: "测试１",
            link: "#"
        },
        {
            img: "https://dn-maimoney.qbox.me/img/index/banner/banner-invite.b838.jpg",
            title: "测试2",
            link: "#"
        },
        {
            img: "https://dn-maimoney.qbox.me/img/index/banner/banner-xiaozhao.de67.jpg",
            title: "测试3",
            link: "#"
        },
        {
            img: "https://dn-maimoney.qbox.me/img/index/banner/banner-2000.afd3.jpg",
            title: "测试4",
            link: "#"
        }
    ]
});
</script>
