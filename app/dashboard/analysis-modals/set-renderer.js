

Vue.component('renderer',{
  components:{
    'color-pick':Slider
  },
  template:`
  <div>
    <modal-helper>
      <table>
        <thead>
          <tr>
            <th>Min Value</th>
            <th>Max Value</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(classBreak,rowIndex) in classBreaks">
            <td>
              <input type="text" name="minVaue" v-model="classBreak.minValue">
            </td>
            <td>
              <input type="text" name="maxVaue" v-model="classBreak.maxValue">
            </td>
            <td>
              <div  style="width: 50px; height:20px;" 
                    :style="{backgroundColor: 'rgb('+ classBreak.color.toString() +')'}"
                    @click="editableRowIndex = rowIndex">
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div  v-if="editableRowIndex != -1" >
        <hr>
          <color-pick v-model="colors" style="width:300px;"/>
          <button class="run-analysis" @click="editColor" > Update </button>
          <div style="clear:both"></div>
        <hr>
      </div>
        
      <button class="run-analysis" @click="setRenderer" > Save </button>

    </modal-helper>
  </div>
  `,
  // :disabled="errors.length > 0 ? true : false"
  data(){
    return{
      classBreaks: [],
      editableRowIndex: -1,
      colors: {
        hex: '#194d33',
        hsl: {h:150,s:0.5,l:0.2,a:1},
        hsv: {h: 150,s: 0.66,v: 0.30, a: 1},
        rgba:{r: 25,g: 77,b: 51,a: 1},
        a: 1
      }    
    }
  },
  methods:{
    hexToRgb: function(hexColor,elem){
      var c;
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)){
          c= hexColor.substring(1).split('');
          if(c.length== 3){
              c= [c[0], c[0], c[1], c[1], c[2], c[2]];
          }
          c= '0x'+c.join('');
          // return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
          return 'rgb('+[(c>>16)&255, (c>>8)&255, c&255]+')';
      }
      throw new Error('Bad hexColor');
    },
    editColor:function(){
      let color = this.colors.rgba;
      this.classBreaks[this.editableRowIndex].color = [color.r, color.g, color.b];
      this.editableRowIndex = -1
    },
    setRenderer:function(){
      window.mapControl.setRenderer(this.classBreaks)
      this.$emit('close')
    }
  },
  created(){
    if(!window.analysisData) window.analysisData = {};
    this.classBreaks = window.analysisData.classBreaks ? window.analysisData.classBreaks : [
      { minValue: 2, maxValue: 6, color: [120, 120, 120] },
      { minValue: 7, maxValue: 10, color: [120, 120, 120] },
      { minValue: 11, maxValue: 13, color: [120, 120, 120] },
      { minValue: 13, maxValue: 20, color: [120, 120, 120] },
    ];
  },
  beforeDestroy(){
    window.analysisData.classBreaks = this.classBreaks;
  },

})