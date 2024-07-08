const DxfWriter = require('dxf-writer');
const fs = require('fs').promises;

async function generateDxf() {
  try {
    const data = await fs.readFile('data.json', 'utf8');
    const jsonData = JSON.parse(data);

    // 创建一个新的 DXF 文档
    let d = new DxfWriter();
    console.log(d)
    // 处理data数组
    jsonData.data.forEach((item, index) => {
      const [type, color, size, rotation, points, content] = item;
      switch (type) {
        case "文字":
          d.drawText(content, points[0], points[1], size, 0);
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
    });

    // 保存到 DXF 文件
    await fs.writeFile('output.dxf', d.toDxfString());

    console.log('DXF 文件已生成: output.dxf');
  } catch (err) {
    console.error(err);
  }
}

generateDxf();
