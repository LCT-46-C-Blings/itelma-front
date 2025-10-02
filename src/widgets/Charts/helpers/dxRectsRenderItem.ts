// helpers/dxRectsRenderItem.ts
export function dxRectsRenderItem(params: any, api: any) {
  const start = api.value(0);
  const end   = api.value(1);
  const y0    = api.value(2);
  const y1    = api.value(3);
  const label = String(api.value(4));

  // координаты грида в пикселях
  const gx = params.coordSys.x;
  const gy = params.coordSys.y;
  const gw = params.coordSys.width;
  const gh = params.coordSys.height;
  const gxr = gx + gw;
  const gyr = gy + gh;

  // пробуем перевести X в пиксели (верхняя кромка, чтобы иметь Y)
  const pStartTop = api.coord([start, y1]); // [x, yTop]
  const pEndTop   = api.coord([end,   y1]); // [x, yTop]

  // если обе X за пределами — прямоугольник весь вне окна
  if ((Number.isNaN(pStartTop[0]) && Number.isNaN(pEndTop[0]))) return null;

  // безопасный X (тот, что внутри окна) — по нему посчитаем Y в пикселях
  const safeXData = Number.isNaN(pEndTop[0]) ? start : end;
  const safeTop   = api.coord([safeXData, y1])[1];
  const safeBot   = api.coord([safeXData, y0])[1];
  if (Number.isNaN(safeTop) || Number.isNaN(safeBot)) return null;

  // получаем X в пикселях с заменой NaN на края грида
  const startX = Number.isNaN(pStartTop[0]) ? gx  : pStartTop[0];
  const endX   = Number.isNaN(pEndTop[0])   ? gxr : pEndTop[0];

  // упорядочим и вырежем по гриду
  const leftPx   = Math.max(gx,  Math.min(startX, endX));
  const rightPx  = Math.min(gxr, Math.max(startX, endX));
  const topPx    = Math.max(gy,  Math.min(safeTop, safeBot));
  const bottomPx = Math.min(gyr, Math.max(safeTop, safeBot));

  const w = rightPx - leftPx;
  const h = bottomPx - topPx;
  if (w <= 0 || h <= 0) return null;

  return {
    type: 'group',
    children: [
      {
        type: 'rect',
        shape: { x: leftPx, y: topPx, width: w, height: h, r: 8 },
        style: {
          fill: 'rgba(255,255,255,0.95)',
          stroke: 'rgba(0,167,181,1)',
          lineWidth: 1,
          shadowBlur: 8,
          shadowColor: 'rgba(0,0,0,0.12)'
        }
      },
      {
        type: 'text',
        style: {
          x: leftPx + 8,
          y: topPx + Math.min(h - 6, 13),
          text: label,
          textVerticalAlign: 'middle',
          textFill: 'rgba(0,120,131,1)',
          fontFamily: 'Gilroy',
          fontSize: 12,
          width: Math.max(40, w - 16), // авто-перенос по ширине карточки
          lineHeight: 14,
          overflow: 'break'
        }
      }
    ],
    clipPath: {
      type: 'rect',
      shape: { x: gx, y: gy, width: gw, height: gh }
    }
  };
}
