const DxfWriter = require('dxf-writer');
const fs = require('fs');

const data = fs.readFileSync('data.json', 'utf8');
const jsonData = JSON.parse(data);

function creatDxf (d, item) {
  const [type, color, size, rotation, points, content] = item;
  switch (type) {
    case "文字":
      d.drawText(points[0], points[1], size, size, content, 'CENTER');
      break;
    case "线":
      for (let i = 0; i < points.length - 2; i += 2) {
        d.drawLine(points[i], points[i + 1], points[i + 2], points[i + 3]);
      }
      break;
    case "点":
      d.drawPoint(points[0], points[1]);
      break;
    case "面":
      for (let i = 0; i < points.length - 4; i += 2) {
        d.drawLine(points[i], points[i + 1], points[i + 2], points[i + 3]);
      }
      d.drawLine(points[points.length - 2], points[points.length - 1], points[0], points[1]);
      break;
    case "圆弧":
      d.drawArc(points[0], points[1], points[2], points[3], points[4]);
      break;
  }
  return d
}

function generateDxf() {
  try {
    // 处理data数组
    jsonData.zuhe.forEach((item, index) => {
      // 创建一个新的 DXF 文档
      let d = new DxfWriter();
      // console.log(d)
      d = creatDxf(d, jsonData['data'][item[0]])
      d = creatDxf(d, jsonData['data'][item[1]])
      // 保存到 DXF 文件
      console.log(item[0], item[1])
      fs.writeFileSync(`./output-${item[0]}${item[1]}.dxf`, d.toDxfString());

      console.log(`DXF 文件已生成: output-${item[0]}${item[1]}.dxf`);
    });

  } catch (err) {
    console.error(err);
  }
}

generateDxf();
