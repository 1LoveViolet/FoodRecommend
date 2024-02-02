<template>
  <div class="goodReview" :data="Reviews">
    <GoodReviewItem
      v-for="(item, index) in pagereviewList"
      :key="index"
      :ReviewsItem="item"
    ></GoodReviewItem>

    <div class="block fenye">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Reviews.length"
        @click="this.getPageInfoClick"
      >
      </el-pagination>
    </div>
  </div>
</template>
    
    <script>
const GoodReviewItem = () => import("../goodReviewItem/index.vue");
export default {
  components: {
    GoodReviewItem,
  },
  props: {
    Reviews: {
      type: Array,
      default() {
        return [];
      },
    },
    pagereviewList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
    };
  },
  created() {
    this.getPageInfoClick();
  },
  mounted() {},
  methods: {
    getPageInfoClick() {
      // console.log("子组件执行了getPageInfoClick()");
      let currentPage = this.currentPage;
      let pagesize = this.pagesize;
      this.$emit("getPageInfoClick", { pagesize, currentPage });
    },
    //分页时修改每页的行数,这里会自动传入一个size
    handleSizeChange(size) {
      //修改当前每页的数据行数
      this.pagesize = size;
      //数据重新分页
      this.getPageInfoClick();
    },
    //调整当前的页码
    handleCurrentChange(pageNumber) {
      //修改当前的页码
      this.currentPage = pageNumber;
      //数据重新分页
      this.getPageInfoClick();
    },
  },
};
</script>
    
    <style scoped>
.goodReview {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: center;
  background: #ffffff;
  border: 1px solid #f0f0f0;
}
.fenye {
  margin: 20px 0px;
}
</style>