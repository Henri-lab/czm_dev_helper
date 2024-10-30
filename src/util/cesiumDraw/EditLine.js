
class EditLine{

    constructor(arg){
        this.viewer = arg.viewer;
        this.entityEdit = arg.entityEdit;
        this.lineEntity = arg.pointIndex;
        this.linePoint  =[]; //活动点
        this.DrawStartEvent = new Cesium.Event();//开始绘制事件
        this.DrawEndEvent = new Cesium.Event();//结束绘制事件
    }
    //创建点位
    createPoint = (item,name,height=0)=>{
        let entity = this.viewer.entities.add({
            name,
            // position: Cesium.Cartesian3.fromDegrees(lon,lat,0),
            position: new Cesium.Cartesian3(item.x,item.y,item.z),
            point:{
                pixelSize:10,
                color: new Cesium.Color(0,0,0,1),
                outlineColor: new Cesium.Color(1,1,0,1),
                outlineWidth:2,
                clampToGround: true,
                // heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
            }
        })
        return entity;
    }

    edits =()=>{
        
        let that = this;
        //绘制活动点
        this.lineEntity.polyline.positions._value.forEach((item,index)=>{
            // console.log(item);
            // let lonlat = this.CartesianLonLat(item);
            this.linePoint.push(
                this.createPoint(item,`路径活动点${index}`)
            )
        })
        //获取路径的经纬度集合
        let positiones = this.lineEntity.polyline.positions._value;


        this.handleres = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
        let handlers = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
        

        this.handleres.setInputAction((movement)=>{
            if(handlers ==null){
                handlers = new Cesium.ScreenSpaceEventHandler(that.viewer.scene.canvas);
              }
            const {position} = movement;
            //屏幕坐标转化为笛卡尔坐标系
            const ray = that.viewer.camera.getPickRay(position);
            const cartesian3 = that.viewer.scene.globe.pick(
                ray,
                that.viewer.scene
            );
            let pick = that.viewer.scene.pick(position);

            if(cartesian3 == undefined)return ;// 点位不在球上 不做操作

            if(Cesium.defined(pick)){
                that.viewer.scene.screenSpaceCameraController.enableInputs  = false;
                handlers.setInputAction((move)=>{
                    // let cartesian = that.viewer.camera.pickEllipsoid(
                    //     move.endPosition,
                    //     that.viewer.scene.globe.ellipsoid
                    // );
                    //屏幕坐标转化为笛卡尔坐标
                    const ray = that.viewer.camera.getPickRay(move.endPosition);
                    const cartesian = that.viewer.scene.globe.pick(ray, that.viewer.scene);
                    if(cartesian == undefined) return;

                    let cartographic =  Cesium.Cartographic.fromCartesian(
                        cartesian,
                        that.viewer.scene.globe.ellipsoid,
                        new Cesium.Cartographic()
                    );
                    console.log(cartesian,'123123123')

                    let lng1 = Cesium.Math.toDegrees(cartographic.longitude);
                    let lat1 = Cesium.Math.toDegrees(cartographic.latitude);

                    if(pick.id.name.indexOf("路径活动点") !==-1){
                        pick.id.position._value = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z)
                        //当前活动点
                        positiones[pick.id.name.split("点")[1]] = new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z)


                        this.lineEntity.position._value = positiones[1];

                        console.log(positiones)
                        //动态绘制线段
                        this.lineEntity.polyline.positions = new Cesium.CallbackProperty(
                            function(){
                                return positiones;
                            },false
                        );
                    }
                },Cesium.ScreenSpaceEventType.MOUSE_MOVE)

                this.handleres.setInputAction(()=>{
                    if(handlers !==null){
                        handlers.destroy();
                        handlers=null;
                    }  
                    this.lineEntity.polyline.positions = positiones;
                    let newLonLat = this.CartesianLonLat(positiones[1])
                    this.entityEdit.lon = newLonLat[0];
                    this.entityEdit.lat = newLonLat[1];
                    this.entityEdit.westSouthEastNorth = positiones;
                    //结束之后的回调函数
                    this.DrawEndEvent.raiseEvent(this.entityEdit,this.lineEntity,this.linePoint);
    
                    that.viewer.scene.screenSpaceCameraController.enableInputs  = true;
                },Cesium.ScreenSpaceEventType.LEFT_UP)
            }
            

            this.handleres.setInputAction(()=>{
                if(this.linePoint.length){
                    this.linePoint.forEach(item=>{
                        that.viewer.entities.remove(item);
                    })
                    this.linePoint = [];
                  }
                if(this.handleres!==null){
                this.handleres.destroy();
                this.handleres =null;
                
                }
                if(handlers !==null){
                    handlers.destroy();
                    handlers=null;
                }   
                this.lineEntity.polyline.positions = positiones;
                let newLonLat = this.CartesianLonLat(positiones[1])
                this.entityEdit.lon = newLonLat[0];
                this.entityEdit.lat = newLonLat[1];
                this.entityEdit.westSouthEastNorth = positiones;
                //结束之后的回调函数
                this.DrawEndEvent.raiseEvent(this.entityEdit,this.lineEntity,this.linePoint);
            },Cesium.ScreenSpaceEventType.MIDDLE_CLICK)
        },Cesium.ScreenSpaceEventType.LEFT_DOWN)
    }
    //笛卡尔坐标系转经纬度
    CartesianLonLat(cartesian3){
        const radians = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
        const lat = Cesium.Math.toDegrees(radians.latitude);
        const lon = Cesium.Math.toDegrees(radians.longitude);
        return [lon,lat]
    }
     //屏幕坐标转换为地形坐标
    getCatesian3 = (coordinate) => {
        var cartesian;
        var ray = viewer.camera.getPickRay(coordinate);
        if (!ray) return null;
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        return cartesian;
    };
    destroys(){
        if(this.handleres!==null){
          this.handleres.destroy();
          this.handleres =null;
          
        }
        if(this.linePoint.length){
            this.linePoint.forEach(item=>{
                that.viewer.entities.remove(item);
            })
            this.linePoint = [];
          }
          
      }
}


export default EditLine;