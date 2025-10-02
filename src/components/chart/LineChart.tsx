import { useEffect, useRef } from 'react';
import {
  type IChartApi,
  type ISeriesApi,
  ColorType,
  CrosshairMode,
  createChart,
  LineStyle,
} from 'lightweight-charts';

import type { CandleDatum } from '../../types/trading';

interface LineChartProps {
  data: CandleDatum[];
}

export function LineChart({ data }: LineChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi>();
  const lineSeriesRef = useRef<ISeriesApi<'Line'>>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255,255,255,0.65)',
        fontFamily: 'Plus Jakarta Sans',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.08, bottom: 0.1 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: { 
          color: 'rgba(80, 227, 194, 0.4)', 
          width: 1, 
          style: LineStyle.Dashed,
          labelBackgroundColor: 'rgba(80, 227, 194, 0.8)',
        },
        horzLine: { 
          color: 'rgba(80, 227, 194, 0.4)', 
          width: 1, 
          style: LineStyle.Dashed,
          labelBackgroundColor: 'rgba(80, 227, 194, 0.8)',
        },
      },
      width: container.clientWidth,
      height: 420,
    });

    chartRef.current = chart;

    const lineSeries = chart.addLineSeries({
      color: 'rgba(80, 227, 194, 1)',
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 6,
      crosshairMarkerBorderColor: 'rgba(80, 227, 194, 1)',
      crosshairMarkerBackgroundColor: 'rgba(80, 227, 194, 0.3)',
    });
    
    lineSeriesRef.current = lineSeries;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          chart.applyOptions({ width: entry.contentRect.width });
        }
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!lineSeriesRef.current) return;
    
    // Convert candle data to line data (using close prices)
    const lineData = data.map((item) => ({
      time: item.time,
      value: item.close,
    }));

    lineSeriesRef.current.setData(lineData);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  return <div ref={containerRef} className="h-[420px] w-full" />;
}
