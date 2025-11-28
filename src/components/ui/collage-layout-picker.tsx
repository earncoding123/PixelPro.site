
'use client';

import { cn } from "@/lib/utils";

export type Layout = {
    id: string;
    name: string;
    slots: number;
    getRects: (width: number, height: number, spacing: number) => { x: number; y: number; w: number; h: number }[];
};

const twoGridHRects = (w: number, h: number, s: number) => [
    { x: s, y: s, w: w / 2 - 1.5 * s, h: h - 2 * s },
    { x: w / 2 + 0.5 * s, y: s, w: w / 2 - 1.5 * s, h: h - 2 * s },
];
const twoGridVRects = (w: number, h: number, s: number) => [
    { x: s, y: s, w: w - 2 * s, h: h / 2 - 1.5 * s },
    { x: s, y: h / 2 + 0.5 * s, w: w - 2 * s, h: h / 2 - 1.5 * s },
];
const threeGridARects = (w: number, h: number, s: number) => [
    { x: s, y: s, w: w / 2 - 1.5 * s, h: h - 2 * s },
    { x: w / 2 + 0.5 * s, y: s, w: w / 2 - 1.5 * s, h: h / 2 - 1.5 * s },
    { x: w / 2 + 0.5 * s, y: h / 2 + 0.5 * s, w: w / 2 - 1.5 * s, h: h / 2 - 1.5 * s },
];
const threeGridBRects = (w: number, h: number, s: number) => [
    { x: s, y: s, w: w - 2 * s, h: h / 2 - 1.5 * s },
    { x: s, y: h / 2 + 0.5 * s, w: w / 2 - 1.5 * s, h: h / 2 - 1.5 * s },
    { x: w / 2 + 0.5 * s, y: h / 2 + 0.5 * s, w: w / 2 - 1.5 * s, h: h / 2 - 1.5 * s },
];
const fourGridRects = (w: number, h: number, s: number) => [
    { x: s, y: s, w: w / 2 - 1.5 * s, h: h / 2 - 1.5 * s },
    { x: w / 2 + 0.5 * s, y: s, w: w / 2 - 1.5 * s, h: h / 2 - 1.5 * s },
    { x: s, y: h / 2 + 0.5 * s, w: w / 2 - 1.5 * s, h: h / 2 - 1.5 * s },
    { x: w / 2 + 0.5 * s, y: h / 2 + 0.5 * s, w: w / 2 - 1.5 * s, h: h / 2 - 1.5 * s },
];
const fourGridAltRects = (w: number, h: number, s: number) => [
    { x: s, y: s, w: (w * 2 / 3) - 1.5 * s, h: h - 2 * s },
    { x: (w * 2 / 3) + 0.5 * s, y: s, w: (w / 3) - 1.5 * s, h: (h / 3) - 1.5 * s },
    { x: (w * 2 / 3) + 0.5 * s, y: (h / 3) + 0.5 * s, w: (w / 3) - 1.5 * s, h: (h / 3) - 1.5 * s },
    { x: (w * 2 / 3) + 0.5 * s, y: (h * 2 / 3) + 0.5 * s, w: (w / 3) - 1.5 * s, h: (h / 3) - 1.5 * s },
];
const threeGridVRects = (w: number, h: number, s: number) => [
    { x: s, y: s, w: w - 2*s, h: h/3 - (4/3)*s },
    { x: s, y: h/3 + (2/3)*s, w: w - 2*s, h: h/3 - (4/3)*s },
    { x: s, y: 2*h/3 + (4/3)*s, w: w-2*s, h: h/3 - (4/3)*s },
];
const fiveGridRects = (w: number, h: number, s: number) => [
    { x: s, y: s, w: w / 2 - 1.5*s, h: h / 2 - 1.5*s },
    { x: w/2 + 0.5*s, y: s, w: w / 2 - 1.5*s, h: h / 2 - 1.5*s },
    { x: s, y: h/2 + 0.5*s, w: w / 3 - (4/3)*s, h: h/2 - 1.5*s },
    { x: w/3 + (2/3)*s, y: h/2 + 0.5*s, w: w / 3 - (4/3)*s, h: h/2 - 1.5*s },
    { x: 2*w/3 + (4/3)*s, y: h/2 + 0.5*s, w: w / 3 - (4/3)*s, h: h/2 - 1.5*s },
];

export const layouts: Layout[] = [
    { id: '2-h', name: '2 Images (H)', slots: 2, getRects: twoGridHRects },
    { id: '2-v', name: '2 Images (V)', slots: 2, getRects: twoGridVRects },
    { id: '3-a', name: '3 Images (A)', slots: 3, getRects: threeGridARects },
    { id: '3-b', name: '3 Images (B)', slots: 3, getRects: threeGridBRects },
    { id: '4-grid', name: '4 Images (Grid)', slots: 4, getRects: fourGridRects },
    { id: '4-alt', name: '4 Images (Alt)', slots: 4, getRects: fourGridAltRects },
    { id: '3-v', name: '3 Images (V)', slots: 3, getRects: threeGridVRects },
    { id: '5-grid', name: '5 Images', slots: 5, getRects: fiveGridRects },
];


type CollageLayoutPickerProps = {
    selectedLayout: Layout;
    onSelectLayout: (layout: Layout) => void;
};

export function CollageLayoutPicker({ selectedLayout, onSelectLayout }: CollageLayoutPickerProps) {
    return (
        <div className="grid grid-cols-4 gap-2">
            {layouts.map(layout => {
                const rects = layout.getRects(50, 50, 2);
                return (
                    <button
                        key={layout.id}
                        onClick={() => onSelectLayout(layout)}
                        className={cn(
                            "relative aspect-square w-full rounded-md border-2 p-1 transition-all",
                            selectedLayout.id === layout.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                        )}
                        title={layout.name}
                    >
                        <div className="relative h-full w-full">
                            {rects.map((rect, i) => (
                                <div
                                    key={i}
                                    className="absolute bg-muted-foreground/50 rounded-sm"
                                    style={{
                                        left: `${rect.x}px`,
                                        top: `${rect.y}px`,
                                        width: `${rect.w}px`,
                                        height: `${rect.h}px`,
                                    }}
                                />
                            ))}
                        </div>
                    </button>
                )
            })}
        </div>
    );
}
