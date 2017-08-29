Vue.component('camera', {
  template:`
    <div class="detail-menu">
      <div class="detail-menu-title" > 
        <div class="back" @click="navigate('up')" style="cursor:pointer"> {{title}} </div> 
        <div class="cat-brief">{{brief}}</div>
      </div>
      <div class="card-container detail-menu-body "> 
          <div class="card detail-card" v-for="(cam,index) in cameras">
            <div class="detail-card-title">{{cam.Title}}</div> 
            <div class="detail-card-body">
              <div class="detail-card-body-col">
                <div  class="card-icon cam-icon" 
                      :class="{'cam-active': activeCamIndex === index }"
                      @click="goToCam(cam, index)">
                </div>
              </div>
              <div  class="detail-card-body-col cam-img" v-if="imageUrl"
                    :style="{backgroundImage: 'url(' + (videoSplash[index] || imageUrl) + ')'}"
                    @click="openPopUp(index)">
              </div>
            </div> 
          </div> 
      </div>
      <div id="video-panel">
      
      </div>
    </div>
  `,
  data(){
    return{
      cameras:[],
      imageUrl:"https://images.webcams.travel/preview/1431552924.jpg",
      activeCamIndex: -1,
      title:"الكاميرات",
      brief:"",
      videoUrl:[
        "./vid/2.mp4",
        "./vid/1.mp4",
      ],
      videoSplash:[
        "./vid/vid2.jpg",
        "./vid/vid1.jpg",
      ]
    }
  },
  methods:{
    navigate:function(newComponent){
      this.$emit('navigate',newComponent)
    },
    getCamsImages:function(){
      this.$http.get('https://webcamstravel.p.mashape.com/webcams/list/webcam=1431552924?show=webcams:location,image',
        {headers:{'X-Mashape-Key':'vAufHQKCy7mshRxEHaXcSZiBClMdp1FeHzwjsnJigOteLHq1jw'}}).then((data) => {
        // let images = data.body.result.webcams.map(c => c.image.current.preview)[0];
        
        this.imageUrl = data.body.result.webcams[0].image.current.preview;
      })
    },
    goToCam: function(cam,index){
      window.cameraControl.goToPoint(cam.location);
      if(this.activeCamIndex === index) {
        this.activeCamIndex = -1;
        window.cameraControl.goToCamera(window.cameraControl.homeCamera);
        window.highlight("camera");
      }
      else {
        this.activeCamIndex = index;
        window.highlight("camera" ,cam.OID);
      }
    },
    openPopUp: function(index){
      // console.log(this.videoSplash[index] || this.imageUrl)

      window.popup.open({title:"بث مباشر للكاميرا",content: this.videoUrl[index] ? `
      <video width="100%" height="100%" autoplay>
        <source src="${this.videoUrl[index]}" type="video/mp4">
      Your browser does not support the video tag.
      </video>` : `<img src="${this.imageUrl}"/>` })
    }
  },
  created(){
    window.appSettings.cameras.layer.visible = true;
    this.cameras = window.appSettings.cameras.features.map(c => {
      var name = c.attributes.streetName;
        return {
          location : c.location ,
          Title : name.length > 28 ?  ' ... ' + name.substr(0,25)  : name, 
          OID : c.OBJECTID 
          // imgUrl: c.properties.cameraUrl
        }
      })
 
    this.brief = `إجمالى عدد الكاميرات : (${this.cameras.length}) كاميرات`
      
    this.getCamsImages();
    
    // update images
    setInterval(()=>{
      this.getCamsImages();
    },50000)
  }
})