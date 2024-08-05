// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// IMPORTANT: this file is auto generated. Please do not edit this file.
/* istanbul ignore file */
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2019 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.tree-outline {
  padding-left: 0;
  color: var(--sys-color-token-subtle);
}

li.storage-group-list-item {
  padding: 10px 8px 6px;
}

li.storage-group-list-item:not(:first-child) {
  border-top: 1px solid var(--sys-color-divider);
}

li.storage-group-list-item::before {
  display: none;
}

.player-entry-row {
  height: 26px;
  min-height: 26px;
  line-height: 26px;

  &:nth-child(odd) {
    background: var(--sys-color-surface1);
  }

  &:hover {
    background: var(--sys-color-state-hover-on-subtle);
  }

  &.selected {
    background: var(--sys-color-tonal-container);
    color: var(--sys-color-on-tonal-container);
  }
}

.player-entry-status-icon-centering {
  margin: auto;
  display: inherit;
}

.player-entry-status-icon {
  width: 28px;
  min-width: 28px;
  height: 26px;
  border-right: 1px solid var(--sys-color-divider);
  overflow: hidden;
}

.player-entry-frame-title {
  height: 26px;
  width: 125px;
  min-width: 125px;
  text-overflow: elipsis;
  padding: 0 10px;
  border-right: 1px solid var(--sys-color-divider);
  overflow: hidden;
}

.player-entry-player-title {
  height: 26px;
  padding-left: 10px;
  overflow: hidden;
}

.player-entry-header {
  height: 27px;
  line-height: 27px;
  min-height: 27px;
  padding-left: 10px;
  border-bottom: 1px solid var(--sys-color-divider);
}

/*# sourceURL=playerListView.css */
`);

export default styles;
