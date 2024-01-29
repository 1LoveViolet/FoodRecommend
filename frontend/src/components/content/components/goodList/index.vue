<template>
  <div class="goodList" :data="goods">
    <GoodsListItem
      v-for="(item, index) in pagegoodList"
      :key="index"
      :goodsItem="item"
    ></GoodsListItem>

    <div class="block fenye">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goods.length"
        @click="this.getPageInfoClick"
      >
      </el-pagination>
    </div>
  </div>
</template>
  
  <script>
const GoodsListItem = () => import("../goodListItem/index.vue");
export default {
  components: {
    GoodsListItem,
  },
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      },
    },
    pagegoodList: {
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
      // goodList: [], //这里是从后端获取的所有数据
      // pagegoodList: [], //分页后的当前页数据
    };
  },
  created() {
    // this.goods.forEach((item) => {
    //   this.pagegoodList.push(item);
    // });
    // this.getPageInfo();
    this.getPageInfoClick();
  },
  mounted() {
    // this.getPageInfo();
    // this.getPageInfoClick();
  },
  methods: {
    // getPropToData(){
    //   this.goods.forEach((item) => {
    //   this.goodList.push(item);
    // });
    // },
    // 获取当前页的数据信息
    // getPageInfo() {
    //   console.log("调用了getPageInfo()");
    //   //清空pagegoodList中的数据
    //   this.pagegoodList = [];
    //   // 获取当前页的数据
    //   for (
    //     let i = (this.currentPage - 1) * this.pagesize;
    //     i < this.goods.length;
    //     i++
    //   ) {
    //     //把遍历的数据添加到pagegoodList里面
    //     this.pagegoodList.push(this.goods[i]);
    //     //判断是否达到一页的要求
    //     if (this.pagegoodList.length === this.pagesize) break;
    //   }
    // },
    getPageInfoClick() {
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
.goodList {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: center;
  background: #ffffff;
}
.fenye {
  margin: 20px 0px;
}
</style>