import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { WORLD_MAP_CELLS, WORLD_MAP_PATH } from '../../data/worldMapData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const VIEWBOX_X = 25;
const VIEWBOX_Y = 8;
const VIEWBOX_WIDTH = 134.5;
const VIEWBOX_HEIGHT = 62;
const VIEWBOX_RIGHT = VIEWBOX_X + VIEWBOX_WIDTH;
const VIEWBOX_BOTTOM = VIEWBOX_Y + VIEWBOX_HEIGHT;
const TEXAS_POINT = { x: 40.5, y: 29.5 };
const HO_CHI_MINH_CITY_POINT = { x: 143.35, y: 39.6 };
const EDGE_PIXELATION_PADDING = 3;
const LEFT_PIXELATION_START = TEXAS_POINT.x - EDGE_PIXELATION_PADDING;
const RIGHT_PIXELATION_START = HO_CHI_MINH_CITY_POINT.x + EDGE_PIXELATION_PADDING;
const CITY_HIT_RADIUS = 8;
const HOVER_RADIUS = 12;
const MAX_CELL_LIFT = 3.4;
const RETURN_DURATION_MS = 520;
const RETURN_OVERSHOOT = 0.025;

export type MapLocationId = 'texas' | 'ho-chi-minh-city';

interface Point {
  x: number;
  y: number;
}

interface DitherWorldMapProps {
  onActiveLocationChange?: (locationId: MapLocationId) => void;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function easeOutQuart(value: number) {
  return 1 - (1 - value) ** 4;
}

function interpolate(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function edgePixelation(cellX: number) {
  let progress = 0;

  if (cellX < LEFT_PIXELATION_START) {
    progress = (LEFT_PIXELATION_START - cellX) / (LEFT_PIXELATION_START - VIEWBOX_X);
  } else if (cellX > RIGHT_PIXELATION_START) {
    progress = (cellX - RIGHT_PIXELATION_START) / (VIEWBOX_RIGHT - RIGHT_PIXELATION_START);
  }

  const clampedProgress = clamp(progress, 0, 1);
  return clampedProgress * clampedProgress * (3 - 2 * clampedProgress);
}

function cellNoise(index: number) {
  return ((index * 47 + 17) % 97) / 96;
}

function shouldRenderCell(index: number, cellX: number) {
  return cellNoise(index) >= edgePixelation(cellX) * 0.58;
}

function pixelatedGlyph(glyph: string, pixelation: number) {
  if (pixelation > 0.7) return '■';
  if (pixelation > 0.32) return '▪';
  return glyph;
}

function edgeCellOpacity(pixelation: number) {
  return 1 - pixelation * 0.45;
}

function cellEnergy(cellX: number, cellY: number, point: Point) {
  const distance = Math.hypot(cellX - point.x, cellY - point.y);
  const proximity = clamp(1 - distance / HOVER_RADIUS, 0, 1);
  return proximity * proximity;
}

function cellTransform(energy: number, reducedMotion: boolean, pixelation = 0) {
  const lift = energy * MAX_CELL_LIFT;
  const scale = 1 + energy * 0.1 + pixelation * 0.65;
  if (reducedMotion) return `scale(${scale})`;
  return `translateY(${-lift}px) scale(${scale})`;
}

function locationForPoint(point: Point): MapLocationId {
  const hoChiMinhCityDistance = Math.hypot(
    point.x - HO_CHI_MINH_CITY_POINT.x,
    point.y - HO_CHI_MINH_CITY_POINT.y,
  );

  return hoChiMinhCityDistance <= CITY_HIT_RADIUS ? 'ho-chi-minh-city' : 'texas';
}

const RESTING_ACTIVE_CELLS = new Set(
  WORLD_MAP_CELLS.flatMap(([x, y], index) =>
    shouldRenderCell(index, x) && cellEnergy(x, y, TEXAS_POINT) > 0 ? [index] : [],
  ),
);

const RENDERED_MAP_CELLS = WORLD_MAP_CELLS.flatMap(([x, y, glyph], index) => {
  if (!shouldRenderCell(index, x)) return [];

  const pixelation = edgePixelation(x);
  return [{ x, y, glyph: pixelatedGlyph(glyph, pixelation), index, pixelation }];
});

export default function DitherWorldMap({ onActiveLocationChange }: DitherWorldMapProps) {
  const reducedMotion = usePrefersReducedMotion();
  const id = useId().replace(/:/g, '');
  const mapRef = useRef<SVGSVGElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const cellRefs = useRef<Array<SVGTextElement | null>>([]);
  const activeCellsRef = useRef(new Set(RESTING_ACTIVE_CELLS));
  const activeLocationRef = useRef<MapLocationId>('texas');
  const animationFrameRef = useRef<number | null>(null);
  const positionRef = useRef<Point>(TEXAS_POINT);

  const descriptionId = `${id}-description`;
  const outlineGradientId = `${id}-outline-gradient`;
  const outlineMaskId = `${id}-outline-mask`;
  const mapClipId = `${id}-map-clip`;

  const cancelReturnAnimation = () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const setPosition = ({ x, y }: Point) => {
    positionRef.current = { x, y };

    if (markerRef.current) {
      markerRef.current.style.transform = `translate(${x - TEXAS_POINT.x}px, ${y - TEXAS_POINT.y}px)`;
    }

    const nextLocation = locationForPoint({ x, y });
    mapRef.current?.setAttribute('data-active-location', nextLocation);
    if (activeLocationRef.current !== nextLocation) {
      activeLocationRef.current = nextLocation;
      onActiveLocationChange?.(nextLocation);
    }

    const nextActiveCells = new Set<number>();

    WORLD_MAP_CELLS.forEach(([cellX, cellY], index) => {
      const energy = cellEnergy(cellX, cellY, { x, y });
      if (energy === 0) return;

      const cell = cellRefs.current[index];
      if (!cell) return;

      const pixelation = edgePixelation(cellX);
      nextActiveCells.add(index);
      cell.style.opacity = String(energy * edgeCellOpacity(pixelation));
      cell.style.transform = cellTransform(energy, reducedMotion, pixelation);
    });

    activeCellsRef.current.forEach((index) => {
      if (nextActiveCells.has(index)) return;

      const cell = cellRefs.current[index];
      if (!cell) return;
      const [cellX] = WORLD_MAP_CELLS[index];
      const pixelation = edgePixelation(cellX);
      cell.style.opacity = '0';
      cell.style.transform = cellTransform(0, reducedMotion, pixelation);
    });

    activeCellsRef.current = nextActiveCells;
  };

  const returnToTexas = () => {
    cancelReturnAnimation();
    mapRef.current?.removeAttribute('data-exploring');

    const from = positionRef.current;
    const distance = Math.hypot(from.x - TEXAS_POINT.x, from.y - TEXAS_POINT.y);

    if (reducedMotion || distance < 0.25) {
      setPosition(TEXAS_POINT);
      return;
    }

    const overshoot = {
      x: TEXAS_POINT.x - (from.x - TEXAS_POINT.x) * RETURN_OVERSHOOT,
      y: TEXAS_POINT.y - (from.y - TEXAS_POINT.y) * RETURN_OVERSHOOT,
    };
    const startedAt = window.performance.now();
    const travelEnd = 0.84;

    const animateReturn = (timestamp: number) => {
      const progress = clamp((timestamp - startedAt) / RETURN_DURATION_MS, 0, 1);
      let nextPoint: Point;

      if (progress <= travelEnd) {
        const travelProgress = easeOutQuart(progress / travelEnd);
        nextPoint = {
          x: interpolate(from.x, overshoot.x, travelProgress),
          y: interpolate(from.y, overshoot.y, travelProgress),
        };
      } else {
        const settleProgress = easeOutQuart((progress - travelEnd) / (1 - travelEnd));
        nextPoint = {
          x: interpolate(overshoot.x, TEXAS_POINT.x, settleProgress),
          y: interpolate(overshoot.y, TEXAS_POINT.y, settleProgress),
        };
      }

      setPosition(nextPoint);

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animateReturn);
      } else {
        animationFrameRef.current = null;
        setPosition(TEXAS_POINT);
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(animateReturn);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.pointerType === 'touch') return;

    cancelReturnAnimation();
    const screenMatrix = event.currentTarget.getScreenCTM();
    if (!screenMatrix) return;

    const svgPoint = new DOMPoint(event.clientX, event.clientY).matrixTransform(screenMatrix.inverse());
    const nextPoint = {
      x: clamp(svgPoint.x, VIEWBOX_X, VIEWBOX_RIGHT),
      y: clamp(svgPoint.y, VIEWBOX_Y, VIEWBOX_BOTTOM),
    };

    event.currentTarget.setAttribute('data-exploring', 'true');
    setPosition(nextPoint);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<SVGSVGElement>) => {
    let nextPoint: Point | null = null;

    if (event.key === 'ArrowRight' || event.key === 'End') {
      nextPoint = HO_CHI_MINH_CITY_POINT;
    }

    if (event.key === 'ArrowLeft' || event.key === 'Home') {
      nextPoint = TEXAS_POINT;
    }

    if (!nextPoint) return;

    event.preventDefault();
    cancelReturnAnimation();
    event.currentTarget.setAttribute('data-exploring', 'true');
    setPosition(nextPoint);
  };

  useEffect(
    () => () => {
      cancelReturnAnimation();
    },
    [],
  );

  return (
    <svg
      ref={mapRef}
      className="v2-world-map"
      viewBox={`${VIEWBOX_X} ${VIEWBOX_Y} ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="img"
      aria-label="Interactive map from Texas to Ho Chi Minh City"
      aria-describedby={descriptionId}
      tabIndex={0}
      data-active-location="texas"
      onPointerMove={handlePointerMove}
      onPointerLeave={returnToTexas}
      onPointerCancel={returnToTexas}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        cancelReturnAnimation();
        mapRef.current?.setAttribute('data-exploring', 'true');
        setPosition(TEXAS_POINT);
      }}
      onBlur={returnToTexas}
    >
      <desc id={descriptionId}>
        A cropped map places Texas on the left and Ho Chi Minh City on the right, with the outer
        geography dissolving into larger pixels. Move the pointer to lift nearby ASCII cells. Hover
        near Ho Chi Minh City to show its local time. The marker and clock return to Texas when the
        pointer leaves. Use the left and right arrow keys to switch cities.
      </desc>

      <defs>
        <linearGradient
          id={outlineGradientId}
          gradientUnits="userSpaceOnUse"
          x1={VIEWBOX_X}
          x2={VIEWBOX_RIGHT}
        >
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="4.5%" stopColor="white" stopOpacity="0.38" />
          <stop
            offset={`${((LEFT_PIXELATION_START - VIEWBOX_X) / VIEWBOX_WIDTH) * 100}%`}
            stopColor="white"
            stopOpacity="1"
          />
          <stop
            offset={`${((RIGHT_PIXELATION_START - VIEWBOX_X) / VIEWBOX_WIDTH) * 100}%`}
            stopColor="white"
            stopOpacity="1"
          />
          <stop offset="95.5%" stopColor="white" stopOpacity="0.38" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask
          id={outlineMaskId}
          maskUnits="userSpaceOnUse"
          x={VIEWBOX_X}
          y={VIEWBOX_Y}
          width={VIEWBOX_WIDTH}
          height={VIEWBOX_HEIGHT}
        >
          <rect
            x={VIEWBOX_X}
            y={VIEWBOX_Y}
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
            fill={`url(#${outlineGradientId})`}
          />
        </mask>
        <clipPath id={mapClipId}>
          <rect
            x={VIEWBOX_X}
            y={VIEWBOX_Y}
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
          />
        </clipPath>
      </defs>

      <g clipPath={`url(#${mapClipId})`}>
        <path
          className="v2-world-map__outline"
          d={WORLD_MAP_PATH}
          fillRule="evenodd"
          clipRule="evenodd"
          mask={`url(#${outlineMaskId})`}
        />

        <g className="v2-world-map__cells v2-world-map__cells--shadow" aria-hidden="true">
          {RENDERED_MAP_CELLS.map(({ x, y, glyph, index, pixelation }) => (
            <text
              key={`shadow-${index}`}
              className="v2-world-map__cell-shadow"
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                opacity: 0.4 * edgeCellOpacity(pixelation),
                transform: cellTransform(0, true, pixelation),
              }}
            >
              {glyph}
            </text>
          ))}
        </g>

        <g className="v2-world-map__cells v2-world-map__cells--lifted" aria-hidden="true">
          {RENDERED_MAP_CELLS.map(({ x, y, glyph, index, pixelation }) => {
            const energy = cellEnergy(x, y, TEXAS_POINT);
            return (
              <text
                key={`lifted-${index}`}
                ref={(node) => {
                  cellRefs.current[index] = node;
                }}
                className="v2-world-map__cell"
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  opacity: energy * edgeCellOpacity(pixelation),
                  transform: cellTransform(energy, reducedMotion, pixelation),
                }}
              >
                {glyph}
              </text>
            );
          })}
        </g>

        <g
          className="v2-world-map__city-anchor"
          transform={`translate(${HO_CHI_MINH_CITY_POINT.x} ${HO_CHI_MINH_CITY_POINT.y})`}
          aria-hidden="true"
        >
          <circle className="v2-world-map__city-anchor-ring" r="3.2" />
          <circle className="v2-world-map__city-anchor-core" r="1.2" />
        </g>

        <g transform={`translate(${TEXAS_POINT.x} ${TEXAS_POINT.y})`}>
          <g ref={markerRef} className="v2-world-map__marker">
            <circle className="v2-world-map__marker-orbit" r="5.5" />
            <circle className="v2-world-map__marker-core" r="1.8" />
          </g>
        </g>
      </g>
    </svg>
  );
}
