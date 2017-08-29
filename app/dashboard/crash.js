Vue.component('crash', {
  template:`
    <div class="detail-menu">
      <div class="detail-menu-title" > 
        <div class="back" @click="navigate('up')" style="cursor:pointer"> {{title}} </div> 
        <div class="cat-brief">{{brief}}</div>
      </div>
      <div class="card-container detail-menu-body"> 
          <div class="card detail-card" v-for="(crash,index) in crashes">
            <div class="detail-card-title">{{crash.time}}</div> 
            <div class="detail-card-body">
              <div class="detail-card-body-col">
                <div  class="card-icon" :style="{backgroundImage:'url('+icon+')'}"
                      :class="{'cam-active': activeCrashesIndex === index }"
                      @click="goToCrash(crash, index)">
                </div>
              </div>
              <div class="detail-card-body-col">
                <div class="crash-stat-no">{{ crash.injueries + crash.death }}</div>
                <div class="card-stat-text">اصابات/وفيات</div>
                
              </div>              
            </div> 
          </div> 
      </div>
    </div>
  `,
  data(){
    return{
      crashes:[],
      activeCrashesIndex: -1,
      title:"الحوادث",
      brief: "not yet",
      icon: "../../img/accident2.png"
    }
  },
  methods:{
    navigate:function(newComponent){
      this.$emit('navigate',newComponent)
    },
    goToCrash: function(crash,index){
      // window.cameraControl.goToPoint(crash.location);
      // if(this.activeCrashesIndex === index) {
      //   this.activeCrashesIndex = -1;
      //   window.cameraControl.goToCamera(window.cameraControl.homeCamera);
      // }
      // else this.activeCrashesIndex = index;


      window.cameraControl.goToPoint(crash.location);
      if(this.activeCrashesIndex === index) {
        this.activeCrashesIndex = -1;
        window.cameraControl.goToCamera(window.cameraControl.homeCamera);
        window.highlight("asasd");
      }
      else {
        this.activeCrashesIndex = index;
        window.highlight("asasd" ,crash.OID);
      }



    },
    toDateTime: function (milsecs) {
      var t = new Date(1970, 0, 1); // Epoch
      t.setMilliseconds(milsecs);
      return t;
    }
  },
  created(){

    window.appSettings.collisions.layer.visible = true;

    let crashList = window.appSettings.collisions.features.map(c => {
      return {
        location : c.location,
        time : (new Date(c.attributes.creationDate)).toDateString()  , 
        injueries: c.attributes.injuries,
        death: c.attributes.death,
        type: c.attributes.category,
        OID : c.OBJECTID 
      }
      })

    if(this.filterList){ 
      crashList = crashList.filter(c => c.type == this.filterList)
      this.title = this.filterList;
      var cat;
      switch (this.filterList){
        case "pedestrian":
          this.title = "حوادث المشاه";
          this.icon = "../img/man.png";
          cat = 3;
        break;
        case "cyclist":
          this.title = "حوادث الدراجات";
          this.icon = "../img/bike.png"
          cat = 4;
        break;
        case "motorist":
          this.title = "حوادث السيارات";
          this.icon = "../img/car.png"
          cat = 5;
        break;
      }
      window.appSettings.collisions.layer.definitionExpression = "Category = " + cat;
    }
    
    this.crashes = crashList;
    this.brief = `عدد المصابين : ${_.sumBy(crashList,(o)=> o.injueries)} - عدد الوفيات : ${_.sumBy(crashList,(o)=> o.death)} - اجمالى عدد الحوادث : ${crashList.length} `
  },
  props:[
    "filterList"
  ]
})