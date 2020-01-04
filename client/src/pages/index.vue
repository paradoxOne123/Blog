<template>
  <div class="index">
		<div id="bgbox" v-if="showWel">
			<div class="welcome">
				<p>Welcome~ 这里是三胖</p>
			</div>
			<div class="enter" @click="enter">
				<i class="el-icon-arrow-down"></i>
			</div>
			<canvas id="canvas" style="width:100%;height:100%;"></canvas>
		</div>
		
    <Header active="index" v-if="showCont"></Header>
    <!-- article List -->
    <el-container v-if="showCont">
      <el-row> 
				<!-- filter -->
				<el-col :span="24">
					<div class="filter">
						<el-radio-group v-model="range" size="medium">
							<el-radio-button label="0">全部</el-radio-button>
							<el-radio-button label="1">我发布的</el-radio-button>
						</el-radio-group>
					</div>
				</el-col>
				<!-- article box -->
        <el-col v-for="(item,index) in list" :key="index" :span="24" style="">
          <el-card class="box-card" shadow="hover">
            <div class="clearfix">
              <el-link type="primary">
                <a class="article-tit" @click="detail(item)">{{ item.title }}</a>
              </el-link>
            </div>
            <div class="cont">
              摘要: {{ item.preview + '...' }}
            </div>
            <div class="footer">{{ item.name + ' &nbsp; ' + item.time.minute }} 
              <el-button @click="editPost(item)" v-if="user&&(item.name===user.name)" style="float: right; padding: 3px 0;margin-left: 10px;" type="text">编辑</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="count"
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
          </el-pagination>
        </el-col>
      </el-row>
      
    </el-container>
  </div>
</template>

<script>
import Header from '../components/Header';
import { circleMagic } from '../assets/js/circleMagic'

import { articleList } from '../api/article'

let list = []

export default {
  name: 'Index',
  components: {
    Header,
    // SideBar
  },
  data () {
    return {
			user: window.sessionStorage.getItem('user') ? JSON.parse(window.sessionStorage.getItem('user')) : null,
      list,
      total: 0,
      currentPage: 1,
			count: 10,
			showWel: window.sessionStorage.getItem('showBg') ? false : true,
			showCont: window.sessionStorage.getItem('showBg') ? true : false,
			range: 0,//筛选项，0:全部 1:我发布的
    }
  },
  created () {
		let self = this
		this.getarticleList(1,10)

		if(this.showWel){
			setTimeout( ()=>{
				circleMagic()
			},0)
		}
  },
  methods: {
		enter() {
			var container = document.getElementById('bgbox'); 
			container.style.position = "relative"
			container.style.marginTop = -container.offsetHeight + 'px'
			this.showCont = true
			setTimeout( ()=> {
				window.sessionStorage.setItem('showBg',true)
				this.showWel = false
			},600)
			
		},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.count = val;
      this.getarticleList(1,val)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getarticleList(val,this.count)
    },
    detail(item) {
      this.$router.push({
        // name: 'Detail',
        path:`/detail?name=${item.name}&title=${item.title}&id=${item._id}`,
        params: {
          name: item.name,
					title: item.title,
					id: item._id
        }
      })   
		},
		editPost(item) {
			this.$router.push({
        name: 'Post',
        params: {
          name: item.name,
					title: item.title,
					id: item._id
        }
      })  
		},
    getarticleList(page, count) {
      articleList({page: page, count: count, range: this.range, name: this.user?this.user.name:null}).then(res => {
        this.list = res.list
        this.total = res.total
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error',
          duration: 2 * 1000
        })
      })
    }
  },
	watch: {
		'range' () {
			this.getarticleList(1,10)
		},
	}
}
</script>
<style scoped>
  .filter{
		border-bottom: 1px solid #ededed;
    text-align: left;
    padding: 15px;
	}
	.filter .el-tag{
		cursor: pointer;
	}
  .welcome{
		text-align: center;
    position: absolute;
    top: 40%;
    left: 35%;
    background: #33333363;
    width: 30%;
		/* height: 20%;		 */
	}
	.welcome p{
		font-size: 22px;
    color: #efefef;
	}
	.enter{
		color: #fff;
    position: absolute;
    bottom: 20px;
    left: 50%;
    font-size: 28px;
    font-weight: bold;
		cursor: pointer;
	}
  .article-tit{
		font-weight: bold;
    font-size: 22px;
    color: #505050;
    margin-bottom: 10px;
    display: inline-block;
    margin-bottom: 10px;
  }
	.article-tit:hover{
		color: #f94764;
	}
	#bgbox{
		left: 0;
		z-index: 100;
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    background: url(../assets/img/bg.jpeg) no-repeat;
		background-size: cover;
		transition: all .6s linear;
		-webkit-transition: all .6s linear;
		-o-transition: all .6s linear;
		-moz-transition: all .6s linear;
	}
</style>
