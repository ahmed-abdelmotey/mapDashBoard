Vue.component('modal-helper',{
  template:`
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <slot>
              <button class="modal-default-button" @click="$emit('close')">OK</button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  `
})

Vue.component('definition',{
  template:`
  <div>
    <modal-helper>
      <label for="min-hight">Min Hight</label>
      <input :class="{'error':(errors.indexOf('minHeight') > -1)}" type="text" name="min-hight" v-model="minHeight">
      </br>
      <label for="max-hight">Max Hight</label>      
      <input :class="{'error':(errors.indexOf('maxHeight') > -1)}" type="text" name="max-hight" v-model="maxHeight">
      </br>
      <button class="run-analysis" @click="definitionExpression" :disabled="errors.length > 0 ? true : false"> Save </button>
    </modal-helper>
  </div>
  `,
  data(){
    return{
      minHeight:"0",
      maxHeight:"19",
    }
  },
  methods:{
    definitionExpression:function(){
      if(this.errors.length == 0){
        window.mapControl.sceneLayer.definitionExpression = `Height > ${this.minHeight} AND Height < ${this.maxHeight}`;
        this.$emit('close');
      }
    },
  },
  computed:{
      errors:function(){
        let errs = [];
        // validation rules goes here
        if (!(/^[0-9]?$|^[1][0-9]$/).test(this.minHeight)) {
          errs.push("minHeight");
        }

        if (!(/^[0-9]?$|^[1][0-9]$/).test(this.maxHeight)) {
          errs.push("maxHeight");
        }
        
        return errs;
      }
  },
  created(){
    if(!window.analysisData) window.analysisData = {};
    let cache = window.analysisData.definitionExpression;
    this.minHeight = cache ? cache.minHeight : 0 ;
    this.maxHeight = cache ? cache.maxHeight : 19 ;
  },
  beforeDestroy(){
    window.analysisData.definitionExpression = {
      minHeight:this.minHeight,
      maxHeight:this.maxHeight
    }
  }
})