<template>
    <div class="unlayout">
        <mheader/>
        <div class="main-verse">
            <div class="verse-title">早发白帝城</div>
            <div class="verse-auth">唐 ・ 李白</div>
            <div class="verse-content">
                <div class="line">
                    <div>朝</div>
                    <draggable class="blank" :list="answerList[0]" :options="{group:'people'}">
                        <div v-for="item in answerList[0]" :key="item.order">{{item.name}}</div>
                    </draggable>
                    <div>白</div>
                    <div>帝</div>
                    <draggable class="blank" :list="answerList[1]" :options="{group:'people'}">
                        <div v-for="item in answerList[1]" :key="item.order">{{item.name}}</div>
                    </draggable>
                    <div>云</div>
                    <div>间</div>
                    <div>，</div>
                </div>
                <div class="line">
                    <div>千</div>
                    <div>里</div>
                    <draggable class="blank" :list="answerList[2]" :options="{group:'people'}">
                        <div v-for="item in answerList[2]" :key="item.order">{{item.name}}</div>
                    </draggable>
                    <draggable class="blank" :list="answerList[3]" :options="{group:'people'}">
                        <div v-for="item in answerList[3]" :key="item.order">{{item.name}}</div>
                    </draggable>
                    <draggable class="blank" :list="answerList[4]" :options="{group:'people'}">
                        <div v-for="item in answerList[4]" :key="item.order">{{item.name}}</div>
                    </draggable>
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
                 <div class="line-num">2/x</div>
            </div>
            <div>
                <div class="question-title">请补充空白处的诗句</div>
            </div>
            <draggable :list="list" :options="{group:'people'}" class="drag-word-contain">
                <div v-for="item in list" :key="item.order">{{item.name}}</div>
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
      answerList: [[], [], [], [], []],
      list: [
        {
          name: "以",
          order: 1
        },
        {
          name: "州",
          order: 2
        },
        {
          name: "辞",
          order: 1
        },
        {
          name: "白",
          order: 1
        },
        {
          name: "猿",
          order: 2
        },
        {
          name: "雨",
          order: 1
        },
        {
          name: "月",
          order: 1
        },
        {
          name: "千",
          order: 2
        },
        {
          name: "天",
          order: 1
        },
        {
          name: "不",
          order: 1
        },
        {
          name: "发",
          order: 1
        },
        {
          name: "凌",
          order: 2
        },
        {
          name: "难",
          order: 1
        },
        {
          name: "已",
          order: 2
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
        div{
            flex:1;
            margin:2px;
            &.blank{
                border-bottom:solid 1px #f15883;
                position:relative;
                div{
                    position:absolute;
                    top:0;
                    left:0;
                    right:0;
                    margin:0;
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