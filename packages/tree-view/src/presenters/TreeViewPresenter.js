import React, { Children, useEffect } from "react";
import PropTypes from "prop-types";
import { css, cx } from "emotion";
import { ThemeContext } from "@hig/theme-context";
import { createCustomClassNames } from "@hig/utils";

import TreeObjectView from "./fileview/TreeObjectView";
import TreeItem from "../TreeItem";

import stylesheet from "./stylesheet";

const objectArray = [];

function createTreeItems(children) {
  return Children.toArray(children).reduce((result, child) => {
    const { type, key, props = {} } = child;

    if (type === TreeItem) {
      result.push({ key, props });
    }

    return result;
  }, []);
}

function buildTreeItemIdArray(list, isTreeNode) {
  const ids = [];

  list.map(item => {
    ids.push(isTreeNode ? Number(item.id) : item.id);
    return null;
  });

  return ids;
}

function renderFileTree(tree, payload) {
  return tree.map(treeNode => {
    const appendPayload = {
      ...treeNode,
      payload
    };
    return (
      <TreeObjectView
        tree={appendPayload}
        keyboardOpenId={payload.getKeyboardOpenId()}
        key={treeNode.id}
      />
    );
  });
}

/**
 *
 * treeObject methods
 */
const getTreeItemArray = collection => {
  objectArray.push(collection.id);

  if (collection.children) {
    collection.children.forEach(child => {
      getTreeItemArray(child);
    });
  }
  return null;
};

const TreeViewPresenterObject = props => {
  /**
   *
   * treeRender methods
   */
  const getTreeItems = () => createTreeItems(props.children);

  // eslint-disable-next-line react/sort-comp
  const renderTreeItem = ({ key, props: propsRef }) => {
    const {
      getActiveTreeItemId,
      getActiveTreeItemIndex,
      getCurrentItemClicked,
      getKeyboardOpenId,
      // eslint-disable-next-line no-shadow
      getTreeItemArray,
      setActiveTreeItemId,
      setActiveTreeItemIndex,
      setKeyboardOpenId,
      guidelines,
      indicator
    } = props;
    const payload = {
      ...propsRef,
      getActiveTreeItemId,
      getActiveTreeItemIndex,
      getCurrentItemClicked,
      getKeyboardOpenId,
      getTreeItemArray,
      setActiveTreeItemId,
      setActiveTreeItemIndex,
      setKeyboardOpenId,
      guidelines,
      indicator,
      key,
      level: 0
    };

    return <TreeItem {...payload} />;
  };

  const renderTreeItems = () => getTreeItems().map(renderTreeItem);

  const renderTreeView = () => {
    const {
      alternateBg,
      children,
      guidelines,
      hasFocus,
      setTreeViewRef,
      stylesheet: customStylesheet,
      ...otherProps
    } = props;
    const { className } = otherProps;
    const payload = { ...otherProps };
    const higTreeViewClassName = createCustomClassNames(
      className,
      `hig-tree-view`
    );

    delete payload.indicator;
    delete payload.dataObject;
    delete payload.getActiveTreeItemId;
    delete payload.getActiveTreeItemIndex;
    delete payload.getCurrentItemClicked;
    delete payload.getKeyboardOpenId;
    delete payload.setTreeItemArray;
    delete payload.treeViewRef;
    delete payload.treeNode;
    delete payload.getTreeItemArray;
    delete payload.setActiveTreeItemId;
    delete payload.setActiveTreeItemIndex;
    delete payload.setKeyboardOpenId;

    return (
      <ThemeContext.Consumer>
        {({ resolvedRoles }) => {
          const styles = stylesheet(
            {
              alternateBg,
              guidelines,
              stylesheet: customStylesheet
            },
            resolvedRoles
          );
          return (
            <div className={cx([css(styles.higTreeViewWrapper), className])}>
              <ul
                {...payload}
                className={cx([css(styles.higTreeView), higTreeViewClassName])}
                ref={setTreeViewRef}
                role="tree"
                tabIndex="0"
              >
                {renderTreeItems()}
              </ul>
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  };

  const renderTreeViewObject = () => {
    const {
      alternateBg,
      children,
      guidelines,
      setTreeViewRef,
      stylesheet: customStylesheet,
      treeNode,
      getCurrentItemClicked,
      getKeyboardOpenId,
      // eslint-disable-next-line no-shadow
      getTreeItemArray,
      setActiveTreeItemId,
      setActiveTreeItemIndex,
      setKeyboardOpenId,
      indicator,
      getActiveTreeItemId,
      getActiveTreeItemIndex,
      setTreeItemArray,
      treeViewRef,
      ...otherProps
    } = props;
    const { className } = otherProps;
    const higTreeViewClassName = createCustomClassNames(
      className,
      `hig-tree-view`
    );

    return (
      <ThemeContext.Consumer>
        {({ resolvedRoles }) => {
          const { onClick } = props;
          const styles = stylesheet(
            {
              alternateBg,
              guidelines,
              stylesheet: customStylesheet
            },
            resolvedRoles
          );

          return (
            <div className={cx([css(styles.higTreeViewWrapper), className])}>
              <ul
                {...otherProps}
                className={cx([css(styles.higTreeView), higTreeViewClassName])}
                ref={setTreeViewRef}
                role="tree"
                tabIndex="0"
              >
                {renderFileTree(treeNode, {
                  getActiveTreeItemId,
                  getActiveTreeItemIndex,
                  guidelines,
                  indicator,
                  stylesheet,
                  onClick,
                  getCurrentItemClicked,
                  getKeyboardOpenId,
                  getTreeItemArray,
                  setActiveTreeItemId,
                  setActiveTreeItemIndex,
                  setKeyboardOpenId,
                  setTreeItemArray,
                  ...otherProps
                })}
              </ul>
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  };

  useEffect(() => {
    if (props.treeNode) {
      getTreeItemArray(props.treeNode);
      props.setTreeItemArray(objectArray);
    }
  }, []);

  useEffect(() => {
    const { treeViewRef } = props;
    if (treeViewRef) {
      if (props.treeNode) {
        const domNodeList = props.treeViewRef.querySelectorAll("li");

        const treeItemArrayControl =
          props.getTreeItemArray().length !== domNodeList.length
            ? buildTreeItemIdArray(
                Array.prototype.slice.call(domNodeList),
                true
              )
            : props.getTreeItemArray();

        if (props.getTreeItemArray().length !== domNodeList.length) {
          props.setTreeItemArray(treeItemArrayControl);
        }
      } else {
        const currentTreeArray = props.getTreeItemArray();
        const newTreeArray = buildTreeItemIdArray(
          Array.prototype.slice.call(props.treeViewRef.querySelectorAll("li")),
          false
        );
        if (JSON.stringify(newTreeArray) !== JSON.stringify(currentTreeArray)) {
          props.setTreeItemArray(
            buildTreeItemIdArray(
              Array.prototype.slice.call(
                props.treeViewRef.querySelectorAll("li")
              ),
              false
            )
          );
        }
        if (!currentTreeArray) {
          props.setTreeItemArray(newTreeArray);
        }
      }
    }
  });

  return props.treeNode ? renderTreeViewObject() : renderTreeView();
};

TreeViewPresenterObject.displayName = "TreeViewPresenterObject";

TreeViewPresenterObject.propTypes = {
  alternateBg: PropTypes.bool,
  children: PropTypes.node,
  getActiveTreeItemIndex: PropTypes.func,
  guidelines: PropTypes.bool,
  indicator: PropTypes.string,
  selected: PropTypes.bool,
  setTreeViewRef: PropTypes.func,
  stylesheet: PropTypes.func
};

export default TreeViewPresenterObject;
