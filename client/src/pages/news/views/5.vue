<template>
    <div class="unlayout">
        <mheader/>
        <div class="main-verse">
            <div class="verse-title">早发白帝城</div>
            <div class="verse-auth">唐 ・ 李白</div>
            <div class="verse-content">
                <div class="line">
                    <div>朝</div>
                    <div>辞</div>
                    <div>白</div>
                    <div>帝</div>
                    <div>彩</div>
                    <div>云</div>
                    <div>间</div>
                    <div>，</div>
                </div>
                <draggable class="line answer" :list="answerList[0]" :options="{group:'people'}">
                    <div v-for="item in answerList[0]" :key="item.order" class="word-contain">
                      <div v-for="(word,index) in item.name" :key="index">
                        {{word}}
                      </div>
                      </div>
                </draggable>
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
                <draggable class="line answer" :list="answerList[1]" :options="{group:'people'}">
                    <div v-for="item in answerList[1]" :key="item.order" class="word-contain">
                      <div v-for="(word,index) in item.name" :key="index">
                        {{word}}
                      </div>
                      </div>
                </draggable>
            </div>
            <div>
                <div class="question-title">请拖动下面的诗句补充到上面空白处</div>
            </div>
            <draggable :list="list" :options="{group:'people'}" class="drag-centence-contain">
                <div v-for="item in list" :key="item.order" class="word-contain">
                  <div v-for="(word,index) in item.name" :key="index">{{word}}</div>
                </div>
            </draggable>
        </div>
        <mfooter/>
    </div>
</template>
<script>
import mheader from "@zoo/components/common/header";
import mfooter from "@zoo/components/common/footer";
import draggable from "vuedraggable";
export default {
  data() {
    return {
      answerList: [[], []],
      list: [
        {
          name: "千里江陵一日还。",
          order: 1
        },
        {
          name: "两岸猿声啼不住。",
          order: 2
        },
        {
          name: "轻舟已过万重山，",
          order: 3
        },
        {
          name: "朝辞白帝彩云间。",
          order: 4
        }
      ]
    };
  },
  components: {
    mheader,
    draggable,
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
    padding:0.4rem;
    font-size:1.1rem;
  }
  .verse-content{
    font-size:1.5rem;
    min-height:13rem;
    .line{
        display:flex;
        width:15rem;
        margin:0 auto;
        line-height:1.8rem;
        margin-bottom:.2rem;
        &.answer{
          height:2.2rem;
          border-bottom:solid 1px #f15883;
        }
        div{
            flex:1;
            margin:2px;
            &.blank{
                border-bottom:solid 1px #f15883;
                position:relative;
                div{
                    margin:0;
                    top:0;
                    left:0;
                    right:0;
                    position:absolute;
                }
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
.drag-centence-contain{
    font-family:'黑体';
    padding:2rem;
}
.word-contain{
    text-align:center;
    height:2rem;
    width:12rem;
    margin:0 auto;
    display:flex;
    div{
      flex:1;
    }
    
}

</style>