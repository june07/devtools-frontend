// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// IMPORTANT: this file is auto generated. Please do not edit this file.
/* istanbul ignore file */
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2021 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

:host {
  overflow: hidden;
}

div {
  line-height: 1.7em;
}

.arrow-icon-button {
  cursor: pointer;
  padding: 1px 0;
  border: none;
  background: none;
  margin-right: 2px;
}

.arrow-icon {
  display: inline-block;
  mask-image: var(--image-file-triangle-right);
  background-color: var(--icon-default);
  margin-top: 2px;
  height: 14px;
  width: 14px;
  transition: transform 200ms;
}

.arrow-icon.expanded {
  transform: rotate(90deg);
}

.expandable-list-container {
  display: flex;
  margin-top: 4px;
}

.expandable-list-items {
  overflow: hidden;
}

.link,
.devtools-link {
  color: var(--sys-color-primary);
  text-decoration: underline;
  cursor: pointer;
  outline-offset: 2px;
}

button.link {
  border: none;
  background: none;
  font-family: inherit;
  font-size: inherit;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*# sourceURL=expandableList.css */
`);

export default styles;
