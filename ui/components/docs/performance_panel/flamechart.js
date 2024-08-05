// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as TraceEngine from '../../../../models/trace/trace.js';
import * as EnvironmentHelpers from '../../../../testing/EnvironmentHelpers.js';
import * as TraceHelpers from '../../../../testing/TraceHelpers.js';
import * as PerfUI from '../../../legacy/components/perf_ui/perf_ui.js';
import * as ComponentSetup from '../../helpers/helpers.js';
await EnvironmentHelpers.initializeGlobalVars();
await ComponentSetup.ComponentServerSetup.setup();
const defaultGroupStyle = {
    height: 17,
    padding: 4,
    collapsible: false,
    color: 'black',
    backgroundColor: 'grey',
    nestingLevel: 0,
    itemsHeight: 17,
};
/**
 * Render a basic flame chart with 3 events on the same level
 **/
function renderBasicExample() {
    class FakeProviderWithBasicEvents extends TraceHelpers.FakeFlameChartProvider {
        timelineData() {
            return PerfUI.FlameChart.FlameChartTimelineData.create({
                entryLevels: [0, 0, 0, 1, 1, 1, 2, 2, 2],
                entryStartTimes: [5, 60, 80, 5, 60, 80, 5, 60, 80],
                entryTotalTimes: [50, 10, 10, 50, 10, 10, 50, 10, 10],
                groups: [
                    {
                        name: 'Test Group 0',
                        startLevel: 0,
                        style: { ...defaultGroupStyle, collapsible: true },
                    },
                    {
                        name: 'Test Group 1',
                        startLevel: 1,
                        style: { ...defaultGroupStyle, collapsible: true, color: 'red', backgroundColor: 'green' },
                    },
                    {
                        name: 'Test Group 2',
                        startLevel: 2,
                        style: { ...defaultGroupStyle, collapsible: true, color: 'blue', backgroundColor: 'yellow' },
                    },
                ],
            });
        }
    }
    const container = document.querySelector('div#basic');
    if (!container) {
        throw new Error('No container');
    }
    const delegate = new TraceHelpers.MockFlameChartDelegate();
    const dataProvider = new FakeProviderWithBasicEvents();
    const flameChart = new PerfUI.FlameChart.FlameChart(dataProvider, delegate);
    flameChart.markAsRoot();
    flameChart.setWindowTimes(0, 100);
    flameChart.show(container);
    flameChart.update();
}
/**
 * Render a flame chart with main thread long events to stripe and a warning triangle.
 **/
function renderLongTaskExample() {
    class FakeProviderWithLongTasksForStriping extends TraceHelpers.FakeFlameChartProvider {
        timelineData() {
            return PerfUI.FlameChart.FlameChartTimelineData.create({
                entryLevels: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2],
                entryStartTimes: [5, 55, 70, 5, 30, 55, 75, 5, 10, 15, 20],
                entryTotalTimes: [45, 10, 20, 20, 20, 5, 15, 4, 4, 4, 4],
                entryDecorations: [
                    [
                        {
                            type: "CANDY" /* PerfUI.FlameChart.FlameChartDecorationType.CANDY */,
                            startAtTime: TraceEngine.Types.Timing.MicroSeconds(25_000),
                        },
                        { type: "WARNING_TRIANGLE" /* PerfUI.FlameChart.FlameChartDecorationType.WARNING_TRIANGLE */ },
                    ],
                    [{ type: "WARNING_TRIANGLE" /* PerfUI.FlameChart.FlameChartDecorationType.WARNING_TRIANGLE */ }],
                    [
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                        { type: "WARNING_TRIANGLE" /* PerfUI.FlameChart.FlameChartDecorationType.WARNING_TRIANGLE */ },
                    ],
                    [
                        {
                            type: "CANDY" /* PerfUI.FlameChart.FlameChartDecorationType.CANDY */,
                            startAtTime: TraceEngine.Types.Timing.MicroSeconds(15_000),
                        },
                    ],
                    [
                        {
                            type: "CANDY" /* PerfUI.FlameChart.FlameChartDecorationType.CANDY */,
                            startAtTime: TraceEngine.Types.Timing.MicroSeconds(10_000),
                        },
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                    ],
                    [
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                    ],
                    [
                        {
                            type: "CANDY" /* PerfUI.FlameChart.FlameChartDecorationType.CANDY */,
                            startAtTime: TraceEngine.Types.Timing.MicroSeconds(10_000),
                        },
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                        { type: "WARNING_TRIANGLE" /* PerfUI.FlameChart.FlameChartDecorationType.WARNING_TRIANGLE */ },
                    ],
                    [
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                    ],
                    [
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                        { type: "WARNING_TRIANGLE" /* PerfUI.FlameChart.FlameChartDecorationType.WARNING_TRIANGLE */ },
                    ],
                    [
                        {
                            type: "CANDY" /* PerfUI.FlameChart.FlameChartDecorationType.CANDY */,
                            startAtTime: TraceEngine.Types.Timing.MicroSeconds(1_000),
                        },
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                    ],
                    [
                        {
                            type: "CANDY" /* PerfUI.FlameChart.FlameChartDecorationType.CANDY */,
                            startAtTime: TraceEngine.Types.Timing.MicroSeconds(1_000),
                        },
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                        { type: "WARNING_TRIANGLE" /* PerfUI.FlameChart.FlameChartDecorationType.WARNING_TRIANGLE */ },
                    ],
                ],
                groups: [{
                        name: 'Testing Candy Stripe, warning triangles and hidden descendants arrow decorations',
                        startLevel: 0,
                        style: defaultGroupStyle,
                    }],
            });
        }
    }
    const container = document.querySelector('div#long-task');
    if (!container) {
        throw new Error('No container');
    }
    const delegate = new TraceHelpers.MockFlameChartDelegate();
    const dataProvider = new FakeProviderWithLongTasksForStriping();
    const flameChart = new PerfUI.FlameChart.FlameChart(dataProvider, delegate);
    flameChart.markAsRoot();
    flameChart.setWindowTimes(0, 100);
    flameChart.show(container);
    flameChart.update();
}
/**
 * Render a flame chart with nested track.
 **/
function renderNestedExample() {
    class FakeProviderWithNestedGroup extends TraceHelpers.FakeFlameChartProvider {
        timelineData() {
            return PerfUI.FlameChart.FlameChartTimelineData.create({
                entryLevels: [0, 1, 2],
                entryStartTimes: [5, 5, 5],
                entryTotalTimes: [50, 50, 50],
                groups: [
                    {
                        name: 'Test Group 0',
                        startLevel: 0,
                        style: { ...defaultGroupStyle, collapsible: true },
                    },
                    {
                        name: 'Test Nested Group 1',
                        startLevel: 0,
                        style: { ...defaultGroupStyle, collapsible: true, color: 'red', backgroundColor: 'green' },
                    },
                    {
                        name: 'Test Group 2',
                        startLevel: 2,
                        style: { ...defaultGroupStyle, collapsible: true, color: 'blue', backgroundColor: 'yellow' },
                    },
                ],
            });
        }
    }
    const container = document.querySelector('div#nested');
    if (!container) {
        throw new Error('No container');
    }
    const delegate = new TraceHelpers.MockFlameChartDelegate();
    const dataProvider = new FakeProviderWithNestedGroup();
    const flameChart = new PerfUI.FlameChart.FlameChart(dataProvider, delegate);
    flameChart.markAsRoot();
    flameChart.setWindowTimes(0, 100);
    flameChart.show(container);
    flameChart.update();
}
/**
 * Render a flame chart with nested case and buttons to hide/unhide and reorder
 * tracks
 **/
function renderTrackCustomizationExample() {
    class FakeProviderWithBasicEvents extends TraceHelpers.FakeFlameChartProvider {
        timelineData() {
            return PerfUI.FlameChart.FlameChartTimelineData.create({
                entryLevels: [0, 0, 1, 1, 2, 2, 3, 3],
                entryStartTimes: [5, 60, 5, 60, 5, 60],
                entryTotalTimes: [50, 10, 50, 10, 50, 10],
                groups: [
                    {
                        name: 'Test Group 0',
                        startLevel: 0,
                        expanded: true,
                        style: { ...defaultGroupStyle, collapsible: true },
                    },
                    {
                        name: 'Test Group 1',
                        startLevel: 1,
                        expanded: true,
                        style: { ...defaultGroupStyle, collapsible: true, color: 'red', backgroundColor: 'green' },
                    },
                    {
                        name: 'Test Group 2',
                        startLevel: 2,
                        expanded: true,
                        style: { ...defaultGroupStyle, collapsible: true, color: 'blue', backgroundColor: 'yellow' },
                    },
                    {
                        name: 'Test Group 3',
                        startLevel: 2,
                        expanded: true,
                        style: { ...defaultGroupStyle, nestingLevel: 1 },
                    },
                ],
            });
        }
    }
    const container = document.querySelector('div#track-customization');
    if (!container) {
        throw new Error('No container');
    }
    const delegate = new TraceHelpers.MockFlameChartDelegate();
    const dataProvider = new FakeProviderWithBasicEvents();
    const flameChart = new PerfUI.FlameChart.FlameChart(dataProvider, delegate);
    flameChart.markAsRoot();
    flameChart.setWindowTimes(0, 100);
    flameChart.show(container);
    flameChart.update();
    const indexInput = document.querySelector('#indexOfTrack');
    const buttonHide = document.querySelector('#hide');
    buttonHide?.addEventListener('click', () => {
        const index = Number(indexInput.value);
        flameChart.hideGroup(index);
    });
    const buttonUnhide = document.querySelector('#unhide');
    buttonUnhide?.addEventListener('click', () => {
        const index = Number(indexInput.value);
        flameChart.showGroup(index);
    });
    const buttonForMoveUp = document.querySelector('#testForMoveUp');
    buttonForMoveUp?.addEventListener('click', () => {
        const index = Number(indexInput.value);
        flameChart.moveGroupUp(index);
    });
    const buttonForMoveDown = document.querySelector('#testForMoveDown');
    buttonForMoveDown?.addEventListener('click', () => {
        const index = Number(indexInput.value);
        flameChart.moveGroupDown(index);
    });
}
/**
 * Render a flame chart with event initiators of different sizes.
 * Some initiator and initiated events are hidden.
 **/
function renderInitiatorsExample() {
    class FakeProviderWithVariousTasksForInitiators extends TraceHelpers.FakeFlameChartProvider {
        timelineData() {
            return PerfUI.FlameChart.FlameChartTimelineData.create({
                entryLevels: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 3],
                entryStartTimes: [5, 5, 5, 15, 15, 15, 40, 40, 40, 55.4, 55.4, 55.4, 80, 80, 80, 17],
                entryTotalTimes: [6, 6, 6, 5, 5, 20, 15, 15, 15, 2, 2, 2, 10, 10, 10, 10],
                entryDecorations: [
                    [],
                    [],
                    [
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                    ],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                    ],
                    [],
                    [],
                    [
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                    ],
                    [
                        { type: "HIDDEN_DESCENDANTS_ARROW" /* PerfUI.FlameChart.FlameChartDecorationType.HIDDEN_DESCENDANTS_ARROW */ },
                    ],
                ],
                initiatorsData: [
                    { initiatorIndex: 2, eventIndex: 3, isInitiatorHidden: true },
                    { initiatorIndex: 1, eventIndex: 13 },
                    { initiatorIndex: 3, eventIndex: 6 },
                    { initiatorIndex: 3, eventIndex: 8, isEntryHidden: true },
                    { initiatorIndex: 6, eventIndex: 11 },
                    { initiatorIndex: 11, eventIndex: 12, isInitiatorHidden: true, isEntryHidden: true },
                    { initiatorIndex: 5, eventIndex: 15 },
                ],
                groups: [{
                        name: 'Testing initiators',
                        startLevel: 0,
                        style: defaultGroupStyle,
                    }],
            });
        }
        maxStackDepth() {
            return 4;
        }
    }
    const container = document.querySelector('div#initiators');
    if (!container) {
        throw new Error('No container');
    }
    const delegate = new TraceHelpers.MockFlameChartDelegate();
    const dataProvider = new FakeProviderWithVariousTasksForInitiators();
    const flameChart = new PerfUI.FlameChart.FlameChart(dataProvider, delegate);
    flameChart.markAsRoot();
    flameChart.setSelectedEntry(14);
    flameChart.setWindowTimes(0, 100);
    flameChart.show(container);
    flameChart.update();
}
renderBasicExample();
renderLongTaskExample();
renderNestedExample();
renderTrackCustomizationExample();
renderInitiatorsExample();
//# sourceMappingURL=flamechart.js.map