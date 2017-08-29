Vue.component('analysis', {
  template:`
    <div class="detail-menu">
      <div class="detail-menu-title" > 
        <div class="back" @click="navigate('up')" style="cursor:pointer"> Analysis </div> 
        <div class="cat-brief"></div>
      </div>
      <div class="detail-menu-body card-container"> 
          <div class="analysis-tool" v-for="tool in tools">
            <div  class="card-icon analysis-icon" 
                  :style="{backgroundImage:'url('+ tool.icon +')'}"
                  @click="showModal = true; currentModal = tool.component"></div>  
            <p class="analysis-text"> {{tool.name}}</p>  
          </div>
      </div>


      <component :is="currentModal" v-if="showModal"  @close="showModal = false"></component>

    </div>
  `,
   //    <definition ></definition>
 
  data(){
    return{
      tools:[
        {name:"definition expression" , component:"definition" ,icon:"../../img/query.png"},
        {name:"assign renderer"       , component:"renderer" ,icon:"../../img/renderer.png"},
      ],
      showModal:false,
      currentModal: ""
    }
  },
  methods:{
    navigate:function(newComponent){
      this.$emit('navigate',newComponent)
    },
    
  }
})


