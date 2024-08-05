// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../../../../core/i18n/i18n.js';
import { assertNotNullOrUndefined } from '../../../../core/platform/platform.js';
import * as SDK from '../../../../core/sdk/sdk.js';
import * as Diff from '../../../../third_party/diff/diff.js';
import * as DataGrid from '../../../../ui/components/data_grid/data_grid.js';
import * as LegacyWrapper from '../../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as LitHtml from '../../../../ui/lit-html/lit-html.js';
import * as PreloadingString from './PreloadingString.js';
const UIStrings = {
    /**
     *@description Column header
     */
    url: 'URL',
    /**
     *@description Column header: Action of preloading (prefetch/prerender)
     */
    action: 'Action',
    /**
     *@description Column header: Status of preloading attempt
     */
    status: 'Status',
    /**
     *@description Text in grid and details: Preloading attempt is not yet triggered.
     */
    statusNotTriggered: 'Not triggered',
    /**
     *@description Text in grid and details: Preloading attempt is eligible but pending.
     */
    statusPending: 'Pending',
    /**
     *@description Text in grid and details: Preloading is running.
     */
    statusRunning: 'Running',
    /**
     *@description Text in grid and details: Preloading finished and the result is ready for the next navigation.
     */
    statusReady: 'Ready',
    /**
     *@description Text in grid and details: Ready, then used.
     */
    statusSuccess: 'Success',
    /**
     *@description Text in grid and details: Preloading failed.
     */
    statusFailure: 'Failure',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/preloading/components/MismatchedPreloadingGrid.ts', UIStrings);
export const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
class PreloadingUIUtils {
    static status(status) {
        // See content/public/browser/preloading.h PreloadingAttemptOutcome.
        switch (status) {
            case "NotTriggered" /* SDK.PreloadingModel.PreloadingStatus.NotTriggered */:
                return i18nString(UIStrings.statusNotTriggered);
            case "Pending" /* SDK.PreloadingModel.PreloadingStatus.Pending */:
                return i18nString(UIStrings.statusPending);
            case "Running" /* SDK.PreloadingModel.PreloadingStatus.Running */:
                return i18nString(UIStrings.statusRunning);
            case "Ready" /* SDK.PreloadingModel.PreloadingStatus.Ready */:
                return i18nString(UIStrings.statusReady);
            case "Success" /* SDK.PreloadingModel.PreloadingStatus.Success */:
                return i18nString(UIStrings.statusSuccess);
            case "Failure" /* SDK.PreloadingModel.PreloadingStatus.Failure */:
                return i18nString(UIStrings.statusFailure);
            // NotSupported is used to handle unreachable case. For example,
            // there is no code path for
            // PreloadingTriggeringOutcome::kTriggeredButPending in prefetch,
            // which is mapped to NotSupported. So, we regard it as an
            // internal error.
            case "NotSupported" /* SDK.PreloadingModel.PreloadingStatus.NotSupported */:
                return i18n.i18n.lockedString('Internal error');
        }
    }
}
const { render, html } = LitHtml;
// Grid component to show prerendering attempts.
export class MismatchedPreloadingGrid extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    static litTagName = LitHtml.literal `devtools-resources-mismatched-preloading-grid`;
    #shadow = this.attachShadow({ mode: 'open' });
    #data = null;
    connectedCallback() {
        this.#shadow.adoptedStyleSheets = [];
        this.#render();
    }
    set data(data) {
        this.#data = data;
        this.#render();
    }
    #render() {
        if (this.#data === null) {
            return;
        }
        const reportsGridData = {
            columns: [
                {
                    id: 'url',
                    title: i18nString(UIStrings.url),
                    widthWeighting: 40,
                    hideable: false,
                    visible: true,
                    sortable: true,
                },
                {
                    id: 'action',
                    title: i18nString(UIStrings.action),
                    widthWeighting: 15,
                    hideable: false,
                    visible: true,
                    sortable: true,
                },
                {
                    id: 'status',
                    title: i18nString(UIStrings.status),
                    widthWeighting: 15,
                    hideable: false,
                    visible: true,
                    sortable: true,
                },
            ],
            rows: this.#buildReportRows(),
            striped: true,
        };
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        render(html `
      <${DataGrid.DataGridController.DataGridController.litTagName} .data=${reportsGridData}>
      </${DataGrid.DataGridController.DataGridController.litTagName}>
    `, this.#shadow, { host: this });
        // clang-format on
    }
    #buildReportRows() {
        function urlRenderer(url, pageURL) {
            function span(additionalProps, s) {
                // Don't insert spaces to prevent spaces for inline blocks.
                // clang-format off
                return LitHtml.html `<span style=${LitHtml.Directives.styleMap(additionalProps)}>${s}</span>`;
                // clang-format on
            }
            const diffs = Diff.Diff.DiffWrapper.charDiff(url, pageURL);
            const contents = diffs.map(diffOp => {
                const s = diffOp[1];
                switch (diffOp[0]) {
                    case Diff.Diff.Operation.Equal:
                        return span({}, s);
                    case Diff.Diff.Operation.Insert:
                        return span({ 'color': 'var(--sys-color-green)', 'text-decoration': 'line-through' }, s);
                    case Diff.Diff.Operation.Delete:
                        return span({ 'color': 'var(--sys-color-error)' }, s);
                    case Diff.Diff.Operation.Edit:
                        return span({ 'color': 'var(--sys-color-green)', 'text-decoration': 'line-through' }, s);
                    default:
                        throw new Error('unreachable');
                }
            }, LitHtml.nothing);
            return LitHtml.html `<div>${contents}</div>`;
        }
        assertNotNullOrUndefined(this.#data);
        const pageURL = this.#data.pageURL;
        // Sort in descending order by diffScore, i.e. most similar one first.
        return this.#data.rows
            .map(row => ({
            row,
            diffScore: Diff.Diff.DiffWrapper.characterScore(row.url, pageURL),
        }))
            .sort((a, b) => b.diffScore - a.diffScore)
            .map(({ row }) => ({
            cells: [
                {
                    columnId: 'url',
                    value: row.url,
                    renderer: () => urlRenderer(row.url, pageURL),
                },
                { columnId: 'action', value: PreloadingString.capitalizedAction(row.action) },
                { columnId: 'status', value: PreloadingUIUtils.status(row.status) },
            ],
        }));
    }
}
customElements.define('devtools-resources-mismatched-preloading-grid', MismatchedPreloadingGrid);
//# sourceMappingURL=MismatchedPreloadingGrid.js.map