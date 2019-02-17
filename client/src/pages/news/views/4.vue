<template>
    <div class="unlayout">
        <mheader/>
        <div class="main-verse">
            <div class="verse-title">早发白帝城</div>
            <div class="verse-auth">唐 李白</div>
            <div class="verse-content">
                <div class="line">
                    <div>朝</div>
                    <div class="blank">{{list2.length>0&&list2[0].name || ''}}</div>
                    <div>白</div>
                    <div>帝</div>
                    <div class="blank"></div>
                    <div>云</div>
                    <div>间</div>
                    <div>，</div>
                </div>
                <div class="line">
                    <div>千</div>
                    <div>里</div>
                    <div class="blank"></div>
                    <div class="blank"></div>
                    <div class="blank"></div>
                    <div>日</div>
                    <div>还</div>
                    <div>。</div>
                </div>
                <div class="line">
                    <div>两</div>
                    <div>岸</div>
                    <div>猿</div>
                    <div>声</div>
                    <div>啼</div>
                    <div>不</div>
                    <div>住</div>
                    <div>，</div>
                </div>
                <div class="line">
                    <div>轻</div>
                    <div>舟</div>
                    <div>已</div>
                    <div>过</div>
                    <div>万</div>
                    <div>重</div>
                    <div>山</div>
                    <div>。</div>
                </div>
            </div>
            <div>
                <div class="question-title">请补充空白处的诗句</div>
            </div>
            <div class="drag-word-contain">
                <div class="mam">以</div>
                <div>州</div>
                <div>辞</div>
                <div>白</div>
                <div>猿</div>
                <div>雨</div>
                <div>月</div>
                <div>千</div>
                <div>天</div>
                <div>已</div>
                <div>不</div>
                <div>发</div>
                <div>凌</div>
                <div>难</div>
                <div>泪</div>
                <div>云</div>
            </div>
        </div>
        <mfooter/>
    </div>
</template>
<script>
import mheader from "@zoo/components/common/header";
import mfooter from "@zoo/components/common/footer";
import interact from 'interactjs'
export default {
  data() {
    return {
        list2:[],
        list:[
            {
                "name": "1",
                "order": 1,
                "fixed": false
            },
            {
                "name": "2",
                "order": 2,
                "fixed": false
            },
        ]
    };
  },
  mounted(){
      var myList = document.querySelector('.drag-word-contain');
      let target = document.querySelector('.verse-content')

        interact('.verse-content .blank').dropzone({
            ondrop: function (event) {
                //console.log(event)
                //event.relatedTarget.textContent = 'Dropped';
            },
        })

        interact('.drag-word-contain div').draggable({
            inertia: true,
            autoScroll: true,
            onmove: dragMoveListener,
            onend:function(event){
                console.log(event)
            },
            onstart:function(){
                console.log(123)
            }
        })


        function dragMoveListener (event) {
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

    

  },
  components: {
    mheader,
    mfooter
  }
};
</script>
<style lang="sass" scoped>
.unlayout{
  padding-top:3.2rem;
  padding-bottom:3.5rem;
  min-height:100%;
  color:black;
}

.main-verse{
  font-family: 'STKaiti';
  text-align: center;
  height:255px;
  line-height:1.8rem;
  padding-top:1rem;
  background: url('~@asset/images/common/versebk.png') bottom no-repeat;
  background-size:100%;
  .verse-title{
    font-size:2rem;
  }
  .verse-auth{
    font-size:1.1rem;
    font-size:0.9rem;
  }
  .verse-content{
    font-size:1.5rem;
    min-height:13rem;
    .line{
        display:flex;
        width:15rem;
        margin:0 auto;
        div{
            flex:1;
            margin:2px;
            &.blank{
                border-bottom:solid 1px #f15883;
            }
        }
    }
  }
  .line-num{
    font-size:0.9rem;
    text-align:right;
    padding-right:1rem;
    color:#8f8f8f;
  }
}
.question-title{
    font-family:'黑体';
    text-align:center;
    height:2rem;
}
.drag-word-contain{
    padding:1rem 2rem;
    div{
        width:2rem;
        height:2rem;
        border:solid 1px #d3d3d3;
        border-radius:3px;
        float:left;
        margin:.3rem;
    }
}

</style>