import { useEffect, useRef } from 'react';
import {
  type IChartApi,
  type ISeriesApi,
  AreaSeriesPartialOptions,
  CandlestickSeriesPartialOptions,
  ColorType,
  CrosshairMode,
  createChart,
} from 'lightweight-charts';

import type { CandleDatum } from '../../types/trading';

interface CandlestickChartProps {
  data: CandleDatum[];
}

export function CandlestickChart({ data }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi>();
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'>>();
  const baselineSeriesRef = useRef<ISeriesApi<'Area'>>();

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
        scaleMargins: { top: 0.08, bottom: 0.2 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: { color: 'rgba(80, 227, 194, 0.4)', width: 1, style: 3 },
        horzLine: { color: 'rgba(80, 227, 194, 0.4)', width: 1, style: 3 },
      },
      width: container.clientWidth,
      height: 420,
    });

    chartRef.current = chart;

    const candleSeriesOptions: CandlestickSeriesPartialOptions = {
      upColor: '#2dd4bf',
      downColor: '#ff5470',
      borderVisible: false,
      wickUpColor: '#2dd4bf',
      wickDownColor: '#ff5470',
    };

    const series = chart.addCandlestickSeries(candleSeriesOptions);
    candleSeriesRef.current = series;

    const baselineSeriesOptions: AreaSeriesPartialOptions = {
      lineColor: 'rgba(56, 107, 255, 0.6)',
      topColor: 'rgba(56, 107, 255, 0.25)',
      bottomColor: 'rgba(56, 107, 255, 0.05)',
      priceLineVisible: false,
    };
    const baseline = chart.addAreaSeries(baselineSeriesOptions);
    baselineSeriesRef.current = baseline;

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
    if (!candleSeriesRef.current || !baselineSeriesRef.current) return;
    const mapped = data.map((item) => ({
      time: item.time as number,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candleSeriesRef.current.setData(mapped);
    baselineSeriesRef.current.setData(
      data.map((item) => ({ time: item.time as number, value: item.close })),
    );

    chartRef.current?.timeScale().fitContent();
  }, [data]);

  return <div ref={containerRef} className="h-[420px] w-full" />;
}
