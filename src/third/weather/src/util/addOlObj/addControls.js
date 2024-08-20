// 根据type的内容找到options对应的opts并添加对应的控件到地图;
// 返回创建的控件数组
export default function addControls(types, optionsArr, $map) {
  let controlArr = [];

  // 确保 types 是数组且 optionsArr 是数组
  if (!Array.isArray(types)) types = [types];  // 确保 types 总是数组
  if (Array.isArray(optionsArr)) {
    types.forEach(type => {
      // 根据类型筛选出对应的选项
      const opts = optionsArr.filter(opt => opt.type === type);
      // 删掉配置中的type选项后进行控件的创建;
      // 但是不能修改输入的配置数组元素，所以copy一份
      const optsToCreate = opts

      // 根据筛选出的选项创建控件
      if (optsToCreate.length > 0) {
        optsToCreate.forEach(opt => {
          delete opt.type;
          let control;
          switch (type) {
            case 'OverviewMap':
              control = new ol.control.OverviewMap(opt);
              break;
            case 'ScaleLine':
              control = new ol.control.ScaleLine(opt);
              break;
            case 'FullScreen':
              control = new ol.control.FullScreen(opt);
              break;
            case 'ZoomSlider':
              control = new ol.control.ZoomSlider(opt);
              break;
            case 'Rotate':
              control = new ol.control.Rotate(opt);
              break;
            case 'MousePosition':
              control = new ol.control.MousePosition(opt);
              break;
            case 'ZoomToExtent':
              control = new ol.control.ZoomToExtent(opt);
              break;
            default:
              console.warn(`Unsupported control type: ${type}`);
              return;
          }
          controlArr.push(control);
        });
      }
      // 如果没有找到任何匹配的配置
      // 提供默认控件
      else {
        switch (type) {
          case 'OverviewMap':
            control = new ol.control.OverviewMap();
            break;
          case 'ScaleLine':
            control = new ol.control.ScaleLine();
            break;
          case 'FullScreen':
            control = new ol.control.FullScreen();
            break;
          case 'ZoomSlider':
            control = new ol.control.ZoomSlider();
            break;
          case 'Rotate':
            control = new ol.control.Rotate();
            break;
          case 'MousePosition':
            control = new ol.control.MousePosition();
            break;
          case 'ZoomToExtent':
            control = new ol.control.ZoomToExtent();
            break;
          default:
            console.warn(`Unsupported control type: ${type}`);
            return;
        }
        controlArr.push(control);
      }

      // 将所有控件添加到地图上
      controlArr.forEach(control => {
        $map.addControl(control);
      });
    });
  }

  return controlArr;
}


