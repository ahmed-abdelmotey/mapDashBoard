Vue.component('cards', {
  template:`
  <div class="card-container">
    <div class="card menu-item" v-for="card in cards" :style="{backgroundColor:card.Color}">
      <div class="menu-title"> {{ card.Title }}</div>
      <div class="menu-body" > 
        <div  class="card-icon" 
              v-bind:style="{ backgroundImage: 'url(' + card.Icon + ')' }" 
              @click="navigate(card.nextComponent)"></div>
        <div class="card-stat">
          <div class="card-stat-no">{{ card.StatNo }}</div>
          <div class="card-stat-text">{{ card.StatText }}</div>
        </div>
      </div>
      <div class="menu-footer" @click="navigate(card.nextComponent)"></div>
    </div> 
  </div>
  `,
  data(){
    return{
      cards:[
        { Color:"rgba(130, 81, 159,0.9)", Title: 'الحاله المرورية', Icon:"./img/trraffic.png", StatNo:28 , StatText:"نقطة مراقبة للطريق", nextComponent:"traffic"},
        { Color:"rgba(115, 91, 153,0.9)", Title: 'كاميرات المتابعة', Icon:"./img/camera.png", StatNo:541 , StatText:"كاميرات", nextComponent:"camera"},
        { Color:"rgba(130, 109, 187,0.9)", Title: 'الحوادث', Icon:"./img/accident2.png", StatNo:563 , StatText:"تصادمات", nextComponent:"crash"},
        { Color:"rgba(47, 128, 203,0.9)", Title: 'حوادث المشاه', Icon:"./img/man.png", StatNo:563 , StatText:"اصابة/وفاة", nextComponent:"pedestrian"},
        { Color:"rgba(44, 147, 193,0.9)", Title: 'حوادث الدراجات', Icon:"./img/bike.png", StatNo:563 , StatText:"اصابة/وفاة", nextComponent:"cyclist"},
        { Color:"rgba(44, 163, 210,0.9)", Title: 'حوادث السيارات', Icon:"./img/car.png", StatNo:563 , StatText:"اصابة/وفاة", nextComponent:"motorist"},
        { Color:"rgba(128, 188, 68,0.9)", Title: 'التحليلات', Icon:"./img/analysis.png", StatNo:2 , StatText:"نوع من التحليلات", nextComponent:"analysis"}, 
      ],
    }
  },
  methods:{
    hexToRgbA: function(hexColor,elem){
      var c;
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)){
          c= hexColor.substring(1).split('');
          if(c.length== 3){
              c= [c[0], c[0], c[1], c[1], c[2], c[2]];
          }
          c= '0x'+c.join('');
          return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
      }
      throw new Error('Bad hexColor');
    },
    navigate:function(newComponent){
      this.$emit('navigate',newComponent)
    },
  },
  created(){
    let settings = window.appSettings;
    
    settings.cameras.layer.visible = false;
    settings.collisions.layer.visible = false;
    settings.traffic.layer.visible = false;

    casCount =  _.groupBy(settings.collisions.features,'attributes.category');

    this.cards[0].StatNo = settings.traffic.features.length;  
    this.cards[1].StatNo = settings.cameras.features.length;
    this.cards[2].StatNo = window.appSettings.collisions.features.length;
    this.cards[3].StatNo = _.sumBy(casCount.pedestrian, (o)=>{return o.attributes.injuries + o.attributes.death });
    this.cards[4].StatNo = _.sumBy(casCount.cyclist, (o)=>{return o.attributes.injuries + o.attributes.death });
    this.cards[5].StatNo = _.sumBy(casCount.motorist, (o)=>{return o.attributes.injuries + o.attributes.death });
  }
})