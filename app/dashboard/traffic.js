Vue.component('traffic', {
  template:`
    <div class="detail-menu">
      <div class="detail-menu-title" > 
        <div class="back" @click="navigate('up')" style="cursor:pointer"> {{title}} </div> 
        <div class="cat-brief">{{brief}}</div>
      </div>
      <div class="card-container detail-menu-body "> 
          <div class="card detail-card" v-for="(car,index) in traffic">
            <div class="detail-card-title">{{car.name}}</div> 
            <div class="detail-card-body">
              <div class="detail-card-body-col">
                <div  class="card-icon" 
                      :class="{'cam-active': activeCamIndex === index }"
                      style="background-image: url(./img/trraffic.png)"
                      @click="goToCam(car, index)"></div>
              </div>
              <div class="detail-card-body-col">
                <div class="traffic-stat-no">{{ car.speedLimit }}</div>
                <div class="traffic-statue" v-bind:class="car.traffic">
                  {{ car.trafficStatus }}
                </div>

              </div>
            </div> 
          </div> 
      </div>
    </div>
  `,
  data(){
    return{
      traffic:[],
      activeCamIndex: -1,
      title:"الحاله المرورية",
      brief:""
    }
  },
  methods:{
    navigate:function(newComponent){
      this.$emit('navigate',newComponent)
    },
    goToCam: function(cam,index){
      window.cameraControl.goToPoint(cam.location);
      if(this.activeCamIndex === index) {
        this.activeCamIndex = -1;
        window.cameraControl.goToCamera(window.cameraControl.homeCamera);
        window.highlight("traffic");
      }
      else {
        this.activeCamIndex = index;
        window.highlight("traffic" ,cam.OID);
      }
    }
  },
  created(){
    window.appSettings.traffic.layer.visible = true;
    
    this.traffic = _.orderBy(window.appSettings.traffic.features.map(c=> {
      var spead = c.attributes.avgSpeed;
      // var points = c.geometry.coordinates;
      var trafficStatus, traffic;
      
      if(spead < 60){
        trafficStatus = "مزدحم";
        traffic = "heavy";
      }
      else if(spead < 100){
        trafficStatus = "متوسط";
        traffic = "semi-heavy";
      }
      else{
        trafficStatus = "خفيف";
        traffic = "light";
      }
      // var name = c.attributes.name.toString().replace(/\b[0-9]+\b/gm,'شارع رقم $&');
      var name = c.attributes.name;
      return {
        name: name.length > 28 ?  ' ... ' + name.substr(0,25)  : name,
        speedLimit: c.attributes.avgSpeed,
        traffic: traffic,
        trafficStatus: trafficStatus,
        location: c.location,
        OID : c.OBJECTID 
      }
    }), 'name');

    
  },
  watch:{
    traffic: function(newTraffic){
      let analysis =  _.countBy(this.traffic,'traffic');
      this.brief = `الحاله المرورية: ${analysis.heavy} طريق مزدحم | ${analysis.heavy} طريق متوسط الازدحام | ${analysis.heavy} زحام خفيف .... الاجمالى (${this.traffic.length}) طريق`
    }
  }
})